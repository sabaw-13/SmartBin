
    import { db } from "./firebase.js";
    import { ref, set, get, onValue, push, update, runTransaction } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    const userId = localStorage.getItem("userId");
    console.log('🔑 Logged-in userId:', userId);
    if (!userId) Swal.fire("❌ Error", "No logged-in user found!", "error");

    const userRef = ref(db, `users/${userId}`);

    // PROFILE DROPDOWN FUNCTIONS
    window.toggleProfileModal = function () {
      const dropdown = document.getElementById("profileDropdown");
      dropdown.classList.toggle("hidden");
    };
    window.toggleMobileMenu = function () {
      const menu = document.getElementById("mobileMenu");
      menu.classList.toggle("hidden");
    };

    // LOGOUT FUNCTION
    window.logout = function () {
      localStorage.removeItem("userId");
      window.location.href = "../index.html";
    };

    // UPDATE USER INFO
    onValue(userRef, snapshot => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const firstName = (data.fullName || "User").split(" ")[0];
      document.getElementById("heroName").textContent = firstName;
      document.getElementById("dropdownName").textContent = firstName;
      document.getElementById("dropdownEmail").textContent = data.email || "";
      document.getElementById("navProfilePic").src = data.profilePic || "../images/user.jpg";
      document.getElementById("mobileProfilePic").src = data.profilePic || "../images/user.jpg";

      document.getElementById("bottleCount").textContent = data.bottles || 0;
      const userTotalWeight = data.recycling?.totalWeight || 0;
      document.getElementById("bottleWeight").textContent = userTotalWeight.toFixed(2);
    });

    // INSERT BOTTLE SESSION FUNCTIONS
    let countdownInterval, timeLeft = 60;
    let currentBinId = null;

        function formatNumberWithCommas(n) {
          return (Math.round(n) || 0).toLocaleString();
        }

    const proceedBtn = document.getElementById("proceedBtn");
    proceedBtn.addEventListener("click", startInsertSession);

    window.openBinModal = function () { document.getElementById("binModal").classList.remove("hidden"); };
    window.closeBinModal = function () { document.getElementById("binModal").classList.add("hidden"); };

    async function startInsertSession() {
      const binId = document.getElementById("binId").value.trim();
      if (!binId) { Swal.fire("⚠️ Enter a valid Bin ID"); return; }

      currentBinId = binId;
      document.getElementById("displayBinId").textContent = binId;

      proceedBtn.disabled = true;
      proceedBtn.textContent = "Waiting for Bin...";

      try {
        await set(ref(db, `bins/${binId}/session`), { bottles: 0, totalWeight: 0, lastWeight: 0, timestamp: Date.now() });
        await set(ref(db, `bins/${binId}/status/action`), "insert");

        // Wait for ready
        let ready = false, attempts = 0;
        while (!ready && attempts < 10) {
          const snap = await get(ref(db, `bins/${binId}/status/ready`));
          if (snap.exists() && snap.val() === true) { ready = true; break; }
          await new Promise(r => setTimeout(r, 500)); attempts++;
        }

        if (!ready) {
          await set(ref(db, `bins/${binId}/status/action`), "done");
          await set(ref(db, `bins/${binId}/status/ready`), false);
          Swal.fire("⚠️ Bin not ready. Please make sure the bin is online.");
          proceedBtn.disabled = false;
          proceedBtn.textContent = "Proceed";
          currentBinId = null;
          return;
        }

        closeBinModal();
        document.getElementById("timerModal").classList.remove("hidden");
        startCountdown();

        const sessionRef = ref(db, `bins/${binId}/session`);
        onValue(sessionRef, snap => {
          if (!snap.exists()) return;
          const data = snap.val();
          document.getElementById("totalBottles").textContent = data.bottles || 0;
          document.getElementById("totalWeight").textContent = (data.totalWeight || 0).toFixed(2);
          document.getElementById("lastWeight").textContent = (data.lastWeight || 0).toFixed(2);
          if ((data.lastWeight || 0) > 0) resetCountdown();
        });

      } catch (err) {
        console.error(err);
        if (currentBinId) {
          await set(ref(db, `bins/${currentBinId}/status/action`), "done");
          await set(ref(db, `bins/${currentBinId}/status/ready`), false);
        }
        Swal.fire("❌ Error", "Failed to start insert session", "error");
        proceedBtn.disabled = false;
        proceedBtn.textContent = "Proceed";
        currentBinId = null;
      }
    }

    function startCountdown() {
      timeLeft = 60;
      document.getElementById("timer").textContent = "01:00";
      clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        timeLeft--;
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
        const seconds = String(timeLeft % 60).padStart(2, "0");
        document.getElementById("timer").textContent = `${minutes}:${seconds}`;
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          Swal.fire("⏳ Session ended", "Click OK to finish and compute bottles/weight", "info").then(() => {
            if (typeof window.finishInsertSession === 'function') window.finishInsertSession();
          });
        }
      }, 1000);
    }
    function resetCountdown() { timeLeft = 60; document.getElementById("timer").textContent = "01:00"; }

    window.finishInsertSession = async function () {
      clearInterval(countdownInterval);
      document.getElementById("timerModal").classList.add("hidden");
      const binId = currentBinId;
      currentBinId = null;
      proceedBtn.disabled = false;
      proceedBtn.textContent = "Proceed";

      if (!userId || !binId) return Swal.fire("❌ Error", "No logged in user or bin!", "error");

      try {
        await set(ref(db, `bins/${binId}/status/action`), "done");
        await set(ref(db, `bins/${binId}/status/ready`), false);

        const snapshot = await get(ref(db, `bins/${binId}/session`));
        let bottles = 0, totalWeight = 0;
        if (snapshot.exists()) { const d = snapshot.val(); bottles = d.bottles || 0; totalWeight = d.totalWeight || 0; }
        console.log('🔍 Session data:', { binId, bottles, totalWeight });
        if (bottles === 0) return Swal.fire("⚠️ No bottles inserted.", "Session ended.", "info");

        const userSnapshot = await get(userRef);
        let prevBottles = userSnapshot.exists() ? (userSnapshot.val().bottles || 0) : 0;
        let prevWeight = userSnapshot.exists() ? (userSnapshot.val().recycling?.totalWeight || 0) : 0;

        const weightRounded = Math.round((totalWeight || 0) * 100) / 100;

        await update(ref(db, `users/${userId}`), {
          bottles: prevBottles + bottles,
          'recycling/totalWeight': prevWeight + weightRounded,
          'recycling/updatedAt': Date.now()
        });

        // Record daily aggregate (not per-session) using transactions
        try {
          console.log('🔍 finishInsertSession - userId:', userId, '| bottles:', bottles, '| weightRounded:', weightRounded);
          // Get today's date in local timezone (not UTC)
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;
          console.log('📅 Today\'s date key:', dateKey);

          // 1) Atomically update user's daily aggregate
          const userDailyRef = ref(db, `users/${userId}/recycling/daily/${dateKey}`);
          console.log('📍 User daily path (transaction):', `users/${userId}/recycling/daily/${dateKey}`);
          const userTxRes = await runTransaction(userDailyRef, (current) => {
            const prevB = current && Number(current.bottles || 0) || 0;
            const prevW = current && Number(current.weight || 0) || 0;
            return {
              bottles: prevB + Number(bottles),
              weight: prevW + Number(weightRounded)
            };
          });
          console.log('✅ User daily transaction completed', userTxRes);
          try {
            const verifyUserDaily = await get(userDailyRef);
            console.log('🔁 Verify user daily after tx:', verifyUserDaily.exists() ? verifyUserDaily.val() : null);
          } catch (e) {
            console.warn('⚠️ Could not read user daily after tx:', e);
          }

          // 2) Atomically update bin's daily aggregate
          const binDailyRef = ref(db, `bins/${binId}/daily/${dateKey}`);
          console.log('📍 Bin daily path (transaction):', `bins/${binId}/daily/${dateKey}`);
          const binTxRes = await runTransaction(binDailyRef, (current) => {
            const prevC = current && Number(current.count || 0) || 0;
            const prevW = current && Number(current.weight || 0) || 0;
            return {
              count: prevC + Number(bottles),
              weight: prevW + Number(weightRounded)
            };
          });
          console.log('✅ Bin daily transaction completed', binTxRes);
          try {
            const verifyBinDaily = await get(binDailyRef);
            console.log('🔁 Verify bin daily after tx:', verifyBinDaily.exists() ? verifyBinDaily.val() : null);
          } catch (e) {
            console.warn('⚠️ Could not read bin daily after tx:', e);
          }
        } catch (e) {
          console.error('❌ Failed to write daily aggregates (transaction):', e);
        }

        // Update the hero display immediately with formatted weights
        document.getElementById("bottleCount").textContent = prevBottles + bottles;
        document.getElementById("bottleWeight").textContent = (prevWeight + weightRounded).toFixed(2);

        Swal.fire("✅ Success", `You inserted ${bottles} bottles weighing ${(weightRounded).toFixed(2)}g.\nTotal recycled: ${ (prevBottles + bottles) } bottles, ${ (prevWeight + weightRounded).toFixed(2) }g`, "success");
      } catch (err) {
        console.error(err);
        Swal.fire("❌ Error", "Failed to finish session", "error");
      }
    };