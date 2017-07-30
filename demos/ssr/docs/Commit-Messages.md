# Commit Messages

Commits should be in the format `[SCOPE] MESSAGE`

## Commit Scopes

* `[docs]`
* `[build]`
* `[i18n]`
* `[test]`
* `[config]`
* `[components/COMPONENT_NAME]`
* `[view/VIEW_NAME]`
* `[router]`, `[styles]`, `[store]`, `[utils]`, ...
* `[resource]`, when working on static files or images

When working in multiple scopes just include the most relevant one.

## Commit Messages

Do read [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

When possible the commit message should begin with:

* `Create`, when creating a file or a new feature from scratch
* `Add`, when adding a feature to an existing file
* `Fix`, when fixing issues with an existing file
* `Remove`, when removing features
* `Update` or `Refactor`, when reworking files

The commit message should always complete the sentence `When applied this commit will... MESSAGE`

## Special commits

It is possible to have special commit such as:

* `[release] Release versione X.Y.Z`
* `[dependency] Update Library to version X.Y.Z`

## Commit Examples

* `[components/Button] Create button component`
* `[docs] Create benchmark document`
* `[views/Home] Add custom header`
* `[resource] Create background image`
