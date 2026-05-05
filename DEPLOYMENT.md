# GitHub and Vercel Deployment

## 1. Commit Locally

```powershell
git init
git add .
git commit -m "Prepare smartBin for Vercel deployment"
```

## 2. Create a GitHub Repository

Create an empty repository on GitHub, then copy its repository URL.

Example:

```text
https://github.com/YOUR_USERNAME/smartbin-capstone.git
```

## 3. Push to GitHub

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartbin-capstone.git
git push -u origin main
```

## 4. Deploy with Vercel

1. Open Vercel.
2. Choose `Add New Project`.
3. Import the GitHub repository.
4. Use these settings:

```text
Framework Preset: Other
Build Command: leave empty
Output Directory: leave empty
Install Command: leave empty
```

5. Deploy.

## 5. Firebase Domain Setup

If login or signup does not work after deployment, add the Vercel domain to Firebase:

```text
Firebase Console > Authentication > Settings > Authorized domains
```

Add both:

```text
your-project.vercel.app
localhost
```

