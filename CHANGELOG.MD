CHANGE LOG

#### templete
```
# <version>
## Breakin Change
{changes}
## Bug Fixes
{changes}
## New features and enhancements
{changes}
```
# 0.4.0
- bugfix and optimize
- Viewer page new implement (support TouchMove)
- upgrade BookInfo UI
- Viewer menus button redirect to new page
- add new book source
- upgrade ListView to FlatList

# 0.3.0
## Bug Fixes
- fix set discovertPage with the last pager when jump previous chapter
## New features and enhancements
- new app logo
- upgrade `antd-mobild` to 1.2.0
- upgrade `react-native` to 0.45.0
  if building happens, see in https://github.com/facebook/react-native/issues/14366
- optimize loading component in viewer page
- add `react-native-vector-icons` module
- separation components in viewer page
- bulk cache chapter
- viewer page bottom dock
- upgrade UI

## optimization
- when the page Unmount remove loading component

# 0.2.2
## New features and enhancements
- modify directory structure
- abstract text utils models
- use realm database
- upgrade antd-mobile 1.0.5 to 1.1.3
- Viewer page add loading animation
- rewrite Book and Viewwer page load logic
- separation of the `Books` pages and `Search` pages

## Bug Fixes
- fix crawl `gbk` encoding of pages
- fix book discover

# 0.1.0
## New features and enhancements
- use ReactNative 0.42.2
- upgrade react-navigation 1.0.0-beta9
- remove webview chapter viewer
