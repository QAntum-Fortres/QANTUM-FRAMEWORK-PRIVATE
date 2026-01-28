# Push Guide for QANTUM-FRAMEWORK-PRIVATE

## Overview

This guide ensures successful pushes to the repository without encountering common errors.

## Pre-Push Checklist

Before pushing changes to the repository, ensure:

1. **No Large Files**: GitHub has a 100MB file size limit
   ```bash
   # Check for large files
   find . -type f -size +50M | grep -v .git
   ```

2. **Clean Working Directory**: Verify all changes are committed
   ```bash
   git status
   ```

3. **Proper .gitignore**: Ensure build artifacts and dependencies are ignored
   - node_modules/
   - dist/, build/
   - Python artifacts (__pycache__/, *.pyc, venv/)
   - Temporary files (*.tmp, *.bak, *.swp)
   - Large data files (consider Git LFS for large files that need versioning)

## Push Workflow

### Standard Push
```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "Your descriptive commit message"

# 4. Push to origin
git push origin <branch-name>
```

### Push All Branches
```bash
# Push all local branches to remote
# ⚠️ Review each branch before pushing all
git push --all origin
```

**Note**: Only use `--all` when you're certain all local branches are ready. For selective pushes, use:
```bash
# Push specific branch
git push origin <branch-name>
```

### Handling Large Files

If you encounter a "Large files detected" error:

1. **Remove the large file from git history** (⚠️ **WARNING: Rewrites history**):
   
   **Recommended approach using git-filter-repo**:
   ```bash
   # Install git-filter-repo if needed
   pip install git-filter-repo
   
   # Remove large file from history
   git filter-repo --path path/to/large/file --invert-paths
   
   # Force push (⚠️ coordinate with team first!)
   git push origin <branch-name> --force
   ```
   
   **Legacy approach** (not recommended):
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/large/file' \
     --prune-empty --tag-name-filter cat -- --all
   
   # ⚠️ Requires force push - coordinate with team!
   git push origin <branch-name> --force
   ```

2. **Or add it to .gitignore** (if not needed in repo):
   ```bash
   echo "path/to/large/file" >> .gitignore
   git rm --cached path/to/large/file
   git commit -m "Remove large file from tracking"
   ```

3. **Or use Git LFS** for large files that must be versioned:
   ```bash
   git lfs install
   git lfs track "*.large-extension"
   git add .gitattributes
   git commit -m "Configure Git LFS for large files"
   ```

## Common Issues

### Issue: "failed to push some refs"
**Solution**: Pull latest changes first
```bash
git pull --rebase origin <branch-name>
git push origin <branch-name>
```

### Issue: "Large files detected"
**Solution**: See "Handling Large Files" section above

### Issue: "Updates were rejected"
**Solution**: Your local branch is behind the remote
```bash
git pull origin <branch-name>
# Resolve any conflicts
git push origin <branch-name>
```

## Repository Status

Current configuration:
- **Repository**: QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE
- **Remote Origin**: https://github.com/QAntum-Fortres/QANTUM-FRAMEWORK-PRIVATE
- **Protected .gitignore**: Prevents accidental commits of build artifacts, temp files, and large data files

## Best Practices

1. **Commit Often**: Make small, frequent commits with clear messages
2. **Pull Regularly**: Stay synced with remote to avoid conflicts
3. **Review Before Push**: Use `git diff` to review changes
4. **Use Branches**: Develop features in separate branches
5. **Keep Repository Clean**: Regularly check for ignored files that shouldn't be tracked

## Quick Reference

```bash
# Current branch status
git status

# View recent commits
git log --oneline -5

# Check remote configuration
git remote -v

# View changes to be committed
git diff --staged

# Push current branch
git push origin $(git branch --show-current)
```

## Support

For issues not covered in this guide:
- Review git error messages carefully
- Check GitHub's documentation: https://docs.github.com
- Verify repository permissions and access
