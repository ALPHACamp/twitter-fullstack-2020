/**
 * @popperjs/core v2.11.7 - MIT License
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
      ? define(['exports'], factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Popper = {}))
}(this, function (exports) {
  'use strict'

  function getWindow (node) {
    if (node == null) {
      return window
    }

    if (node.toString() !== '[object Window]') {
      const ownerDocument = node.ownerDocument
      return ownerDocument ? ownerDocument.defaultView || window : window
    }

    return node
  }

  function isElement (node) {
    const OwnElement = getWindow(node).Element
    return node instanceof OwnElement || node instanceof Element
  }

  function isHTMLElement (node) {
    const OwnElement = getWindow(node).HTMLElement
    return node instanceof OwnElement || node instanceof HTMLElement
  }

  function isShadowRoot (node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false
    }

    const OwnElement = getWindow(node).ShadowRoot
    return node instanceof OwnElement || node instanceof ShadowRoot
  }

  const max = Math.max
  const min = Math.min
  const round = Math.round

  function getUAString () {
    const uaData = navigator.userAgentData

    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function (item) {
        return item.brand + '/' + item.version
      }).join(' ')
    }

    return navigator.userAgent
  }

  function isLayoutViewport () {
    return !/^((?!chrome|android).)*safari/i.test(getUAString())
  }

  function getBoundingClientRect (element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false
    }

    const clientRect = element.getBoundingClientRect()
    let scaleX = 1
    let scaleY = 1

    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1
    }

    const _ref = isElement(element) ? getWindow(element) : window
    const visualViewport = _ref.visualViewport

    const addVisualOffsets = !isLayoutViewport() && isFixedStrategy
    const x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX
    const y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY
    const width = clientRect.width / scaleX
    const height = clientRect.height / scaleY
    return {
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x: x,
      y: y
    }
  }

  function getWindowScroll (node) {
    const win = getWindow(node)
    const scrollLeft = win.pageXOffset
    const scrollTop = win.pageYOffset
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    }
  }

  function getHTMLElementScroll (element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    }
  }

  function getNodeScroll (node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node)
    } else {
      return getHTMLElementScroll(node)
    }
  }

  function getNodeName (element) {
    return element ? (element.nodeName || '').toLowerCase() : null
  }

  function getDocumentElement (element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument // $FlowFixMe[prop-missing]
      : element.document) || window.document).documentElement
  }

  function getWindowScrollBarX (element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft
  }

  function getComputedStyle (element) {
    return getWindow(element).getComputedStyle(element)
  }

  function isScrollParent (element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    const _getComputedStyle = getComputedStyle(element)
    const overflow = _getComputedStyle.overflow
    const overflowX = _getComputedStyle.overflowX
    const overflowY = _getComputedStyle.overflowY

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
  }

  function isElementScaled (element) {
    const rect = element.getBoundingClientRect()
    const scaleX = round(rect.width) / element.offsetWidth || 1
    const scaleY = round(rect.height) / element.offsetHeight || 1
    return scaleX !== 1 || scaleY !== 1
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.

  function getCompositeRect (elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false
    }

    const isOffsetParentAnElement = isHTMLElement(offsetParent)
    const offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent)
    const documentElement = getDocumentElement(offsetParent)
    const rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed)
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    }
    let offsets = {
      x: 0,
      y: 0
    }

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent)
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true)
        offsets.x += offsetParent.clientLeft
        offsets.y += offsetParent.clientTop
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement)
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    }
  }

  // means it doesn't take into account transforms.

  function getLayoutRect (element) {
    const clientRect = getBoundingClientRect(element) // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    let width = element.offsetWidth
    let height = element.offsetHeight

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    }
  }

  function getParentNode (element) {
    if (getNodeName(element) === 'html') {
      return element
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    )
  }

  function getScrollParent (node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node
    }

    return getScrollParent(getParentNode(node))
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents (element, list) {
    let _element$ownerDocumen

    if (list === void 0) {
      list = []
    }

    const scrollParent = getScrollParent(element)
    const isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body)
    const win = getWindow(scrollParent)
    const target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent
    const updatedList = list.concat(target)
    return isBody ? updatedList // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      : updatedList.concat(listScrollParents(getParentNode(target)))
  }

  function isTableElement (element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0
  }

  function getTrueOffsetParent (element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === 'fixed') {
      return null
    }

    return element.offsetParent
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block

  function getContainingBlock (element) {
    const isFirefox = /firefox/i.test(getUAString())
    const isIE = /Trident/i.test(getUAString())

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      const elementCss = getComputedStyle(element)

      if (elementCss.position === 'fixed') {
        return null
      }
    }

    let currentNode = getParentNode(element)

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host
    }

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      const css = getComputedStyle(currentNode) // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode
      } else {
        currentNode = currentNode.parentNode
      }
    }

    return null
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.

  function getOffsetParent (element) {
    const window = getWindow(element)
    let offsetParent = getTrueOffsetParent(element)

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent)
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
      return window
    }

    return offsetParent || getContainingBlock(element) || window
  }

  const top = 'top'
  const bottom = 'bottom'
  const right = 'right'
  const left = 'left'
  const auto = 'auto'
  const basePlacements = [top, bottom, right, left]
  const start = 'start'
  const end = 'end'
  const clippingParents = 'clippingParents'
  const viewport = 'viewport'
  const popper = 'popper'
  const reference = 'reference'
  const variationPlacements = /* #__PURE__ */basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + '-' + start, placement + '-' + end])
  }, [])
  const placements = /* #__PURE__ */[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + '-' + start, placement + '-' + end])
  }, []) // modifiers that need to read the DOM

  const beforeRead = 'beforeRead'
  const read = 'read'
  const afterRead = 'afterRead' // pure-logic modifiers

  const beforeMain = 'beforeMain'
  const main = 'main'
  const afterMain = 'afterMain' // modifier with the purpose to write to the DOM (or write into a framework state)

  const beforeWrite = 'beforeWrite'
  const write = 'write'
  const afterWrite = 'afterWrite'
  const modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite]

  function order (modifiers) {
    const map = new Map()
    const visited = new Set()
    const result = []
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier)
    }) // On visiting object, check for its dependencies and visit them recursively

    function sort (modifier) {
      visited.add(modifier.name)
      const requires = [].concat(modifier.requires || [], modifier.requiresIfExists || [])
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          const depModifier = map.get(dep)

          if (depModifier) {
            sort(depModifier)
          }
        }
      })
      result.push(modifier)
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier)
      }
    })
    return result
  }

  function orderModifiers (modifiers) {
    // order based on dependencies
    const orderedModifiers = order(modifiers) // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase
      }))
    }, [])
  }

  function debounce (fn) {
    let pending
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined
            resolve(fn())
          })
        })
      }

      return pending
    }
  }

  function format (str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key]
    }

    return [].concat(args).reduce(function (p, c) {
      return p.replace(/%s/, c)
    }, str)
  }

  const INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s'
  const MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available'
  const VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options']
  function validateModifiers (modifiers) {
    modifiers.forEach(function (modifier) {
      [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
        .filter(function (value, index, self) {
          return self.indexOf(value) === index
        }).forEach(function (key) {
          switch (key) {
            case 'name':
              if (typeof modifier.name !== 'string') {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'))
              }

              break

            case 'enabled':
              if (typeof modifier.enabled !== 'boolean') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'))
              }

              break

            case 'phase':
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', 'either ' + modifierPhases.join(', '), '"' + String(modifier.phase) + '"'))
              }

              break

            case 'fn':
              if (typeof modifier.fn !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'))
              }

              break

            case 'effect':
              if (modifier.effect != null && typeof modifier.effect !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'))
              }

              break

            case 'requires':
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'))
              }

              break

            case 'requiresIfExists':
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'))
              }

              break

            case 'options':
            case 'data':
              break

            default:
              console.error('PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function (s) {
                return '"' + s + '"'
              }).join(', ') + '; but "' + key + '" was provided.')
          }

          modifier.requires && modifier.requires.forEach(function (requirement) {
            if (modifiers.find(function (mod) {
              return mod.name === requirement
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement))
            }
          })
        })
    })
  }

  function uniqueBy (arr, fn) {
    const identifiers = new Set()
    return arr.filter(function (item) {
      const identifier = fn(item)

      if (!identifiers.has(identifier)) {
        identifiers.add(identifier)
        return true
      }
    })
  }

  function getBasePlacement (placement) {
    return placement.split('-')[0]
  }

  function mergeByName (modifiers) {
    const merged = modifiers.reduce(function (merged, current) {
      const existing = merged[current.name]
      merged[current.name] = existing
        ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        })
        : current
      return merged
    }, {}) // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key]
    })
  }

  function getViewportRect (element, strategy) {
    const win = getWindow(element)
    const html = getDocumentElement(element)
    const visualViewport = win.visualViewport
    let width = html.clientWidth
    let height = html.clientHeight
    let x = 0
    let y = 0

    if (visualViewport) {
      width = visualViewport.width
      height = visualViewport.height
      const layoutViewport = isLayoutViewport()

      if (layoutViewport || !layoutViewport && strategy === 'fixed') {
        x = visualViewport.offsetLeft
        y = visualViewport.offsetTop
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    }
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect (element) {
    let _element$ownerDocumen

    const html = getDocumentElement(element)
    const winScroll = getWindowScroll(element)
    const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body
    const width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0)
    const height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0)
    let x = -winScroll.scrollLeft + getWindowScrollBarX(element)
    const y = -winScroll.scrollTop

    if (getComputedStyle(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    }
  }

  function contains (parent, child) {
    const rootNode = child.getRootNode && child.getRootNode() // First, attempt with faster native method

    if (parent.contains(child)) {
      return true
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
      let next = child

      do {
        if (next && parent.isSameNode(next)) {
          return true
        } // $FlowFixMe[prop-missing]: need a better way to handle this...

        next = next.parentNode || next.host
      } while (next)
    } // Give up, the result is false

    return false
  }

  function rectToClientRect (rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    })
  }

  function getInnerBoundingClientRect (element, strategy) {
    const rect = getBoundingClientRect(element, false, strategy === 'fixed')
    rect.top = rect.top + element.clientTop
    rect.left = rect.left + element.clientLeft
    rect.bottom = rect.top + element.clientHeight
    rect.right = rect.left + element.clientWidth
    rect.width = element.clientWidth
    rect.height = element.clientHeight
    rect.x = rect.left
    rect.y = rect.top
    return rect
  }

  function getClientRectFromMixedType (element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)))
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`

  function getClippingParents (element) {
    const clippingParents = listScrollParents(getParentNode(element))
    const canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0
    const clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element

    if (!isElement(clipperElement)) {
      return []
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414

    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body'
    })
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents

  function getClippingRect (element, boundary, rootBoundary, strategy) {
    const mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary)
    const clippingParents = [].concat(mainClippingParents, [rootBoundary])
    const firstClippingParent = clippingParents[0]
    const clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      const rect = getClientRectFromMixedType(element, clippingParent, strategy)
      accRect.top = max(rect.top, accRect.top)
      accRect.right = min(rect.right, accRect.right)
      accRect.bottom = min(rect.bottom, accRect.bottom)
      accRect.left = max(rect.left, accRect.left)
      return accRect
    }, getClientRectFromMixedType(element, firstClippingParent, strategy))
    clippingRect.width = clippingRect.right - clippingRect.left
    clippingRect.height = clippingRect.bottom - clippingRect.top
    clippingRect.x = clippingRect.left
    clippingRect.y = clippingRect.top
    return clippingRect
  }

  function getVariation (placement) {
    return placement.split('-')[1]
  }

  function getMainAxisFromPlacement (placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y'
  }

  function computeOffsets (_ref) {
    const reference = _ref.reference
    const element = _ref.element
    const placement = _ref.placement
    const basePlacement = placement ? getBasePlacement(placement) : null
    const variation = placement ? getVariation(placement) : null
    const commonX = reference.x + reference.width / 2 - element.width / 2
    const commonY = reference.y + reference.height / 2 - element.height / 2
    let offsets

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        }
        break

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        }
        break

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        }
        break

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        }
        break

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        }
    }

    const mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null

    if (mainAxis != null) {
      const len = mainAxis === 'y' ? 'height' : 'width'

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2)
          break

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2)
          break
      }
    }

    return offsets
  }

  function getFreshSideObject () {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }

  function mergePaddingObject (paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject)
  }

  function expandToHashMap (value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value
      return hashMap
    }, {})
  }

  function detectOverflow (state, options) {
    if (options === void 0) {
      options = {}
    }

    const _options = options
    const _options$placement = _options.placement
    const placement = _options$placement === void 0 ? state.placement : _options$placement
    const _options$strategy = _options.strategy
    const strategy = _options$strategy === void 0 ? state.strategy : _options$strategy
    const _options$boundary = _options.boundary
    const boundary = _options$boundary === void 0 ? clippingParents : _options$boundary
    const _options$rootBoundary = _options.rootBoundary
    const rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary
    const _options$elementConte = _options.elementContext
    const elementContext = _options$elementConte === void 0 ? popper : _options$elementConte
    const _options$altBoundary = _options.altBoundary
    const altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary
    const _options$padding = _options.padding
    const padding = _options$padding === void 0 ? 0 : _options$padding
    const paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
    const altContext = elementContext === popper ? reference : popper
    const popperRect = state.rects.popper
    const element = state.elements[altBoundary ? altContext : elementContext]
    const clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy)
    const referenceClientRect = getBoundingClientRect(state.elements.reference)
    const popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    })
    const popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets))
    const elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    const overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    }
    const offsetData = state.modifiersData.offset // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      const offset = offsetData[placement]
      Object.keys(overflowOffsets).forEach(function (key) {
        const multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1
        const axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x'
        overflowOffsets[key] += offset[axis] * multiply
      })
    }

    return overflowOffsets
  }

  const INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.'
  const INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.'
  const DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  }

  function areValidElements () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key]
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function')
    })
  }

  function popperGenerator (generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {}
    }

    const _generatorOptions = generatorOptions
    const _generatorOptions$def = _generatorOptions.defaultModifiers
    const defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def
    const _generatorOptions$def2 = _generatorOptions.defaultOptions
    const defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2
    return function createPopper (reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions
      }

      let state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      }
      let effectCleanupFns = []
      let isDestroyed = false
      var instance = {
        state: state,
        setOptions: function setOptions (setOptionsAction) {
          const options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction
          cleanupModifierEffects()
          state.options = Object.assign({}, defaultOptions, state.options, options)
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          } // Orders the modifiers based on their dependencies and `phase`
          // properties

          const orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))) // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled
          }) // Validate the provided modifiers so that the consumer will get warned
          // if one of the modifiers is invalid for any reason

          {
            const modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
              const name = _ref.name
              return name
            })
            validateModifiers(modifiers)

            if (getBasePlacement(state.options.placement) === auto) {
              const flipModifier = state.orderedModifiers.find(function (_ref2) {
                const name = _ref2.name
                return name === 'flip'
              })

              if (!flipModifier) {
                console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '))
              }
            }

            const _getComputedStyle = getComputedStyle(popper)
            const marginTop = _getComputedStyle.marginTop
            const marginRight = _getComputedStyle.marginRight
            const marginBottom = _getComputedStyle.marginBottom
            const marginLeft = _getComputedStyle.marginLeft // We no longer take into account `margins` on the popper, and it can
            // cause bugs with positioning, so we'll warn the consumer

            if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
              return parseFloat(margin)
            })) {
              console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '))
            }
          }

          runModifierEffects()
          return instance.update()
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate () {
          if (isDestroyed) {
            return
          }

          const _state$elements = state.elements
          const reference = _state$elements.reference
          const popper = _state$elements.popper // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            {
              console.error(INVALID_ELEMENT_ERROR)
            }

            return
          } // Store the reference and popper rects to be read by modifiers

          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          } // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false
          state.placement = state.options.placement // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data)
          })
          let __debug_loops__ = 0

          for (let index = 0; index < state.orderedModifiers.length; index++) {
            {
              __debug_loops__ += 1

              if (__debug_loops__ > 100) {
                console.error(INFINITE_LOOP_ERROR)
                break
              }
            }

            if (state.reset === true) {
              state.reset = false
              index = -1
              continue
            }

            const _state$orderedModifie = state.orderedModifiers[index]
            const fn = _state$orderedModifie.fn
            const _state$orderedModifie2 = _state$orderedModifie.options
            const _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2
            const name = _state$orderedModifie.name

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate()
            resolve(state)
          })
        }),
        destroy: function destroy () {
          cleanupModifierEffects()
          isDestroyed = true
        }
      }

      if (!areValidElements(reference, popper)) {
        {
          console.error(INVALID_ELEMENT_ERROR)
        }

        return instance
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state)
        }
      }) // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects () {
        state.orderedModifiers.forEach(function (_ref3) {
          const name = _ref3.name
          const _ref3$options = _ref3.options
          const options = _ref3$options === void 0 ? {} : _ref3$options
          const effect = _ref3.effect

          if (typeof effect === 'function') {
            const cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            })

            const noopFn = function noopFn () {}

            effectCleanupFns.push(cleanupFn || noopFn)
          }
        })
      }

      function cleanupModifierEffects () {
        effectCleanupFns.forEach(function (fn) {
          return fn()
        })
        effectCleanupFns = []
      }

      return instance
    }
  }

  const passive = {
    passive: true
  }

  function effect$2 (_ref) {
    const state = _ref.state
    const instance = _ref.instance
    const options = _ref.options
    const _options$scroll = options.scroll
    const scroll = _options$scroll === void 0 ? true : _options$scroll
    const _options$resize = options.resize
    const resize = _options$resize === void 0 ? true : _options$resize
    const window = getWindow(state.elements.popper)
    const scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper)

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive)
      })
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive)
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive)
        })
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive)
      }
    }
  } // eslint-disable-next-line import/no-unused-modules

  const eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn () {},
    effect: effect$2,
    data: {}
  }

  function popperOffsets (_ref) {
    const state = _ref.state
    const name = _ref.name
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    })
  } // eslint-disable-next-line import/no-unused-modules

  const popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  }

  const unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  } // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR (_ref, win) {
    const x = _ref.x
    const y = _ref.y
    const dpr = win.devicePixelRatio || 1
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    }
  }

  function mapToStyles (_ref2) {
    let _Object$assign2

    const popper = _ref2.popper
    const popperRect = _ref2.popperRect
    const placement = _ref2.placement
    const variation = _ref2.variation
    const offsets = _ref2.offsets
    const position = _ref2.position
    const gpuAcceleration = _ref2.gpuAcceleration
    const adaptive = _ref2.adaptive
    const roundOffsets = _ref2.roundOffsets
    const isFixed = _ref2.isFixed
    const _offsets$x = offsets.x
    let x = _offsets$x === void 0 ? 0 : _offsets$x
    const _offsets$y = offsets.y
    let y = _offsets$y === void 0 ? 0 : _offsets$y

    const _ref3 = typeof roundOffsets === 'function'
      ? roundOffsets({
        x: x,
        y: y
      })
      : {
          x: x,
          y: y
        }

    x = _ref3.x
    y = _ref3.y
    const hasX = offsets.hasOwnProperty('x')
    const hasY = offsets.hasOwnProperty('y')
    let sideX = left
    let sideY = top
    const win = window

    if (adaptive) {
      let offsetParent = getOffsetParent(popper)
      let heightProp = 'clientHeight'
      let widthProp = 'clientWidth'

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper)

        if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
          heightProp = 'scrollHeight'
          widthProp = 'scrollWidth'
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

      offsetParent = offsetParent

      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom
        const offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height // $FlowFixMe[prop-missing]
          : offsetParent[heightProp]
        y -= offsetY - popperRect.height
        y *= gpuAcceleration ? 1 : -1
      }

      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right
        const offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width // $FlowFixMe[prop-missing]
          : offsetParent[widthProp]
        x -= offsetX - popperRect.width
        x *= gpuAcceleration ? 1 : -1
      }
    }

    const commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides)

    const _ref4 = roundOffsets === true
      ? roundOffsetsByDPR({
        x: x,
        y: y
      }, getWindow(popper))
      : {
          x: x,
          y: y
        }

    x = _ref4.x
    y = _ref4.y

    if (gpuAcceleration) {
      let _Object$assign

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? 'translate(' + x + 'px, ' + y + 'px)' : 'translate3d(' + x + 'px, ' + y + 'px, 0)', _Object$assign))
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + 'px' : '', _Object$assign2[sideX] = hasX ? x + 'px' : '', _Object$assign2.transform = '', _Object$assign2))
  }

  function computeStyles (_ref5) {
    const state = _ref5.state
    const options = _ref5.options
    const _options$gpuAccelerat = options.gpuAcceleration
    const gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat
    const _options$adaptive = options.adaptive
    const adaptive = _options$adaptive === void 0 ? true : _options$adaptive
    const _options$roundOffsets = options.roundOffsets
    const roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets

    {
      const transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || ''

      if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
        return transitionProperty.indexOf(property) >= 0
      })) {
        console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '))
      }
    }

    const commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration,
      isFixed: state.options.strategy === 'fixed'
    }

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })))
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })))
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    })
  } // eslint-disable-next-line import/no-unused-modules

  const computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles (_ref) {
    const state = _ref.state
    Object.keys(state.elements).forEach(function (name) {
      const style = state.styles[name] || {}
      const attributes = state.attributes[name] || {}
      const element = state.elements[name] // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]

      Object.assign(element.style, style)
      Object.keys(attributes).forEach(function (name) {
        const value = attributes[name]

        if (value === false) {
          element.removeAttribute(name)
        } else {
          element.setAttribute(name, value === true ? '' : value)
        }
      })
    })
  }

  function effect$1 (_ref2) {
    const state = _ref2.state
    const initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    }
    Object.assign(state.elements.popper.style, initialStyles.popper)
    state.styles = initialStyles

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow)
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        const element = state.elements[name]
        const attributes = state.attributes[name] || {}
        const styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]) // Set all values to an empty string to unset them

        const style = styleProperties.reduce(function (style, property) {
          style[property] = ''
          return style
        }, {}) // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return
        }

        Object.assign(element.style, style)
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute)
        })
      })
    }
  } // eslint-disable-next-line import/no-unused-modules

  const applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$1,
    requires: ['computeStyles']
  }

  function distanceAndSkiddingToXY (placement, rects, offset) {
    const basePlacement = getBasePlacement(placement)
    const invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1

    const _ref = typeof offset === 'function'
      ? offset(Object.assign({}, rects, {
        placement: placement
      }))
      : offset
    let skidding = _ref[0]
    let distance = _ref[1]

    skidding = skidding || 0
    distance = (distance || 0) * invertDistance
    return [left, right].indexOf(basePlacement) >= 0
      ? {
          x: distance,
          y: skidding
        }
      : {
          x: skidding,
          y: distance
        }
  }

  function offset (_ref2) {
    const state = _ref2.state
    const options = _ref2.options
    const name = _ref2.name
    const _options$offset = options.offset
    const offset = _options$offset === void 0 ? [0, 0] : _options$offset
    const data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset)
      return acc
    }, {})
    const _data$state$placement = data[state.placement]
    const x = _data$state$placement.x
    const y = _data$state$placement.y

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x
      state.modifiersData.popperOffsets.y += y
    }

    state.modifiersData[name] = data
  } // eslint-disable-next-line import/no-unused-modules

  const offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  }

  const hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  }
  function getOppositePlacement (placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched]
    })
  }

  const hash = {
    start: 'end',
    end: 'start'
  }
  function getOppositeVariationPlacement (placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched]
    })
  }

  function computeAutoPlacement (state, options) {
    if (options === void 0) {
      options = {}
    }

    const _options = options
    const placement = _options.placement
    const boundary = _options.boundary
    const rootBoundary = _options.rootBoundary
    const padding = _options.padding
    const flipVariations = _options.flipVariations
    const _options$allowedAutoP = _options.allowedAutoPlacements
    const allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP
    const variation = getVariation(placement)
    const placements$1 = variation
      ? flipVariations
        ? variationPlacements
        : variationPlacements.filter(function (placement) {
          return getVariation(placement) === variation
        })
      : basePlacements
    let allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0
    })

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1

      {
        console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '))
      }
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...

    const overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)]
      return acc
    }, {})
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b]
    })
  }

  function getExpandedFallbackPlacements (placement) {
    if (getBasePlacement(placement) === auto) {
      return []
    }

    const oppositePlacement = getOppositePlacement(placement)
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)]
  }

  function flip (_ref) {
    const state = _ref.state
    const options = _ref.options
    const name = _ref.name

    if (state.modifiersData[name]._skip) {
      return
    }

    const _options$mainAxis = options.mainAxis
    const checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis
    const _options$altAxis = options.altAxis
    const checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis
    const specifiedFallbackPlacements = options.fallbackPlacements
    const padding = options.padding
    const boundary = options.boundary
    const rootBoundary = options.rootBoundary
    const altBoundary = options.altBoundary
    const _options$flipVariatio = options.flipVariations
    const flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio
    const allowedAutoPlacements = options.allowedAutoPlacements
    const preferredPlacement = state.options.placement
    const basePlacement = getBasePlacement(preferredPlacement)
    const isBasePlacement = basePlacement === preferredPlacement
    const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement))
    const placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto
        ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        })
        : placement)
    }, [])
    const referenceRect = state.rects.reference
    const popperRect = state.rects.popper
    const checksMap = new Map()
    let makeFallbackChecks = true
    let firstFittingPlacement = placements[0]

    for (let i = 0; i < placements.length; i++) {
      const placement = placements[i]

      const _basePlacement = getBasePlacement(placement)

      const isStartVariation = getVariation(placement) === start
      const isVertical = [top, bottom].indexOf(_basePlacement) >= 0
      const len = isVertical ? 'width' : 'height'
      const overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      })
      let mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide)
      }

      const altVariationSide = getOppositePlacement(mainVariationSide)
      const checks = []

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0)
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0)
      }

      if (checks.every(function (check) {
        return check
      })) {
        firstFittingPlacement = placement
        makeFallbackChecks = false
        break
      }

      checksMap.set(placement, checks)
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      const numberOfChecks = flipVariations ? 3 : 1

      const _loop = function _loop (_i) {
        const fittingPlacement = placements.find(function (placement) {
          const checks = checksMap.get(placement)

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check
            })
          }
        })

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement
          return 'break'
        }
      }

      for (let _i = numberOfChecks; _i > 0; _i--) {
        const _ret = _loop(_i)

        if (_ret === 'break') break
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true
      state.placement = firstFittingPlacement
      state.reset = true
    }
  } // eslint-disable-next-line import/no-unused-modules

  const flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  }

  function getAltAxis (axis) {
    return axis === 'x' ? 'y' : 'x'
  }

  function within (min$1, value, max$1) {
    return max(min$1, min(value, max$1))
  }
  function withinMaxClamp (min, value, max) {
    const v = within(min, value, max)
    return v > max ? max : v
  }

  function preventOverflow (_ref) {
    const state = _ref.state
    const options = _ref.options
    const name = _ref.name
    const _options$mainAxis = options.mainAxis
    const checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis
    const _options$altAxis = options.altAxis
    const checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis
    const boundary = options.boundary
    const rootBoundary = options.rootBoundary
    const altBoundary = options.altBoundary
    const padding = options.padding
    const _options$tether = options.tether
    const tether = _options$tether === void 0 ? true : _options$tether
    const _options$tetherOffset = options.tetherOffset
    const tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset
    const overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    })
    const basePlacement = getBasePlacement(state.placement)
    const variation = getVariation(state.placement)
    const isBasePlacement = !variation
    const mainAxis = getMainAxisFromPlacement(basePlacement)
    const altAxis = getAltAxis(mainAxis)
    const popperOffsets = state.modifiersData.popperOffsets
    const referenceRect = state.rects.reference
    const popperRect = state.rects.popper
    const tetherOffsetValue = typeof tetherOffset === 'function'
      ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      }))
      : tetherOffset
    const normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number'
      ? {
          mainAxis: tetherOffsetValue,
          altAxis: tetherOffsetValue
        }
      : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue)
    const offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null
    const data = {
      x: 0,
      y: 0
    }

    if (!popperOffsets) {
      return
    }

    if (checkMainAxis) {
      let _offsetModifierState$

      const mainSide = mainAxis === 'y' ? top : left
      const altSide = mainAxis === 'y' ? bottom : right
      const len = mainAxis === 'y' ? 'height' : 'width'
      const offset = popperOffsets[mainAxis]
      const min$1 = offset + overflow[mainSide]
      const max$1 = offset - overflow[altSide]
      const additive = tether ? -popperRect[len] / 2 : 0
      const minLen = variation === start ? referenceRect[len] : popperRect[len]
      const maxLen = variation === start ? -popperRect[len] : -referenceRect[len] // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      const arrowElement = state.elements.arrow
      const arrowRect = tether && arrowElement
        ? getLayoutRect(arrowElement)
        : {
            width: 0,
            height: 0
          }
      const arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject()
      const arrowPaddingMin = arrowPaddingObject[mainSide]
      const arrowPaddingMax = arrowPaddingObject[altSide] // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      const arrowLen = within(0, referenceRect[len], arrowRect[len])
      const minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis
      const maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis
      const arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow)
      const clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0
      const offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0
      const tetherMin = offset + minOffset - offsetModifierValue - clientOffset
      const tetherMax = offset + maxOffset - offsetModifierValue
      const preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1)
      popperOffsets[mainAxis] = preventedOffset
      data[mainAxis] = preventedOffset - offset
    }

    if (checkAltAxis) {
      let _offsetModifierState$2

      const _mainSide = mainAxis === 'x' ? top : left

      const _altSide = mainAxis === 'x' ? bottom : right

      const _offset = popperOffsets[altAxis]

      const _len = altAxis === 'y' ? 'height' : 'width'

      const _min = _offset + overflow[_mainSide]

      const _max = _offset - overflow[_altSide]

      const isOriginSide = [top, left].indexOf(basePlacement) !== -1

      const _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0

      const _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis

      const _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max

      const _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max)

      popperOffsets[altAxis] = _preventedOffset
      data[altAxis] = _preventedOffset - _offset
    }

    state.modifiersData[name] = data
  } // eslint-disable-next-line import/no-unused-modules

  const preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  }

  const toPaddingObject = function toPaddingObject (padding, state) {
    padding = typeof padding === 'function'
      ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      }))
      : padding
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
  }

  function arrow (_ref) {
    let _state$modifiersData$

    const state = _ref.state
    const name = _ref.name
    const options = _ref.options
    const arrowElement = state.elements.arrow
    const popperOffsets = state.modifiersData.popperOffsets
    const basePlacement = getBasePlacement(state.placement)
    const axis = getMainAxisFromPlacement(basePlacement)
    const isVertical = [left, right].indexOf(basePlacement) >= 0
    const len = isVertical ? 'height' : 'width'

    if (!arrowElement || !popperOffsets) {
      return
    }

    const paddingObject = toPaddingObject(options.padding, state)
    const arrowRect = getLayoutRect(arrowElement)
    const minProp = axis === 'y' ? top : left
    const maxProp = axis === 'y' ? bottom : right
    const endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len]
    const startDiff = popperOffsets[axis] - state.rects.reference[axis]
    const arrowOffsetParent = getOffsetParent(arrowElement)
    const clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0
    const centerToReference = endDiff / 2 - startDiff / 2 // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    const min = paddingObject[minProp]
    const max = clientSize - arrowRect[len] - paddingObject[maxProp]
    const center = clientSize / 2 - arrowRect[len] / 2 + centerToReference
    const offset = within(min, center, max) // Prevents breaking syntax highlighting...

    const axisProp = axis
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$)
  }

  function effect (_ref2) {
    const state = _ref2.state
    const options = _ref2.options
    const _options$element = options.element
    let arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element

    if (arrowElement == null) {
      return
    } // CSS selector

    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement)

      if (!arrowElement) {
        return
      }
    }

    {
      if (!isHTMLElement(arrowElement)) {
        console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '))
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      {
        console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '))
      }

      return
    }

    state.elements.arrow = arrowElement
  } // eslint-disable-next-line import/no-unused-modules

  const arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  }

  function getSideOffsets (overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      }
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    }
  }

  function isAnySideFullyClipped (overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0
    })
  }

  function hide (_ref) {
    const state = _ref.state
    const name = _ref.name
    const referenceRect = state.rects.reference
    const popperRect = state.rects.popper
    const preventedOffsets = state.modifiersData.preventOverflow
    const referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    })
    const popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    })
    const referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect)
    const popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets)
    const isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets)
    const hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets)
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    })
  } // eslint-disable-next-line import/no-unused-modules

  const hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  }

  const defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1]
  const createPopper$1 = /* #__PURE__ */popperGenerator({
    defaultModifiers: defaultModifiers$1
  }) // eslint-disable-next-line import/no-unused-modules

  const defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1]
  const createPopper = /* #__PURE__ */popperGenerator({
    defaultModifiers: defaultModifiers
  }) // eslint-disable-next-line import/no-unused-modules

  exports.applyStyles = applyStyles$1
  exports.arrow = arrow$1
  exports.computeStyles = computeStyles$1
  exports.createPopper = createPopper
  exports.createPopperLite = createPopper$1
  exports.defaultModifiers = defaultModifiers
  exports.detectOverflow = detectOverflow
  exports.eventListeners = eventListeners
  exports.flip = flip$1
  exports.hide = hide$1
  exports.offset = offset$1
  exports.popperGenerator = popperGenerator
  exports.popperOffsets = popperOffsets$1
  exports.preventOverflow = preventOverflow$1

  Object.defineProperty(exports, '__esModule', { value: true })
}))
// # sourceMappingURL=popper.js.map
