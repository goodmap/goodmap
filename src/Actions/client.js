import {notify}                   from "reapop"

import T                          from "../constants/ActionTypes";
import C                          from "../constants/Categories"
import {notificationSettings}     from "../constants/view"
import GeoLocation                from "../GeoLocation";
import mapConst                   from "../constants/Map";
import V                          from "../constants/PanelView"
import serverActions              from "./server";
import WebAPI from "../WebAPI"

const Actions = {

  setCustomizations: (customizations) => ({
    type: T.SET_CUSTOMIZATIONS,
    payload: customizations
  }),

  setSearchText: (txt) => ({
    type: T.SET_SEARCH_TEXT,
    payload: txt
  }),

  backupSearchText: () => ({type: T.BACKUP_SEARCH_TEXT}),

  restoreSearchText: () => ({type: T.RESTORE_SEARCH_TEXT}),

  restoreSearch: () =>
    (dispatch) => {
      dispatch(Actions.restoreSearchText())
      dispatch(serverActions.Actions.search())
    },

  setCitySearchText: (txt) => ({
    type: T.SET_CITY_SEARCH_TEXT,
    payload: txt
  }),

  finishCitySearch: () => ({
    type: T.FINISH_CITY_SEARCH
  }),

  enableSearchCategory: (category) => {
    return {
      type: T.ENABLE_SEARCH_CATEGORY,
      payload: category
    };
  },

  disableSearchCategory: (category) => {
    return {
      type: T.DISABLE_SEARCH_CATEGORY,
      payload: category
    };
  },

  toggleMenu          : () => ({ type: T.TOGGLE_MENU }),
  showMenu            : () => ({ type: T.SHOW_MENU }),

  showNewEntry: () =>
    (dispatch) => {
      // dispatch(Actions.setSearchText(''));
      dispatch(serverActions.Actions.search());
      dispatch({
        type: T.SHOW_NEW_ENTRY
      });

    },

  showSearchResults   : () => ({ type: T.SHOW_SEARCH_RESULTS }),
  toggleLandingPage   : () => ({ type: T.TOGGLE_MENU }),
  showImprint         : () => ({ type: T.SHOW_IMPRINT }),
  showPrivacyStatement: () => ({ type: T.SHOW_PRIVACY_STATEMENT }),

  cancelNew           : () =>
    (dispatch) => {
      // dispatch(Actions.restoreSearch())
      dispatch({ type: T.CANCEL_NEW })
    },

  cancelEdit          : () => ({ type: T.CANCEL_EDIT }),
  cancelRating        : () => ({ type: T.CANCEL_RATING }),
  cancelWait          : () => ({ type: T.CANCEL_WAIT_IO }),
  showLeftPanel       : () => ({ type: T.SHOW_LEFT_PANEL }),
  hideLeftPanel       : () => ({ type: T.HIDE_LEFT_PANEL }),

  showNotification: (message, status) => (dispatch) => {
    return (
      dispatch(notify({
        ...notificationSettings,
        message,
        status,
      }))
    )
  },

  showEmbedModal: () =>
    (dispatch) => {
      dispatch({
        type: T.SHOW_EMBED_MODAL,
        payload: V.EMBED
      })
    },

  closeModal: () =>
    (dispatch) => {
      dispatch({
        type: T.CLOSE_MODAL
      })
    },

  hideLeftPanelOnMobile: () =>
    (dispatch) => {
      if (document.documentElement.clientWidth < 600) {
        dispatch(Actions.hideLeftPanel())
      }
    },

  showAllEntries: () =>
    (dispatch, getState) => {
      dispatch({
        type: T.FETCH_ALL_ENTRIES,
      });
      const allIDs = [];
      if(Array.isArray(getState().search.entryResults)){
        allIDs.push(allIDs, getState().search.entryResults.map(e => e.id));
      }
      if(Array.isArray(getState().search.invisible)){
        allIDs.push(allIDs, getState().search.invisible.map(e => e.id));
      }
      dispatch(serverActions.Actions.getEntries(allIDs));
    },

  showNewRating: (id) => ({
    type: T.SHOW_NEW_RATING,
    payload: id
  }),

  showNewComment: (context) => ({
    type: T.SHOW_NEW_COMMENT,
    payload: context
  }),

  showInfo: (key) => ({
    type: T.SHOW_INFO,
    payload: key
  }),

  showSubscribeToBbox: () => ({
    type: T.SHOW_SUBSCRIBE_TO_BBOX
  }),

  logout: () => ({
    type: T.LOGOUT
  }),

  setCenter: (centerOrEntryId) => {
    return {
      type: T.SET_MAP_CENTER,
      payload: centerOrEntryId
    };
  },

  setZoom: (zoom) => {
    zoom = Math.round(parseFloat(zoom) * 100) / 100 //round to 2 decimals
    return {
      type: T.SET_ZOOM,
      payload: zoom
    };
  },

  setBbox: (bbox) => {
    return {
      type: T.SET_BBOX,
      payload: bbox
    };
  },

  setRegion: (regionName) =>
    (dispatch, getState) => {
      WebAPI.searchAddressNominatim(regionName, (err, results) => {
        if (err) {
          console.error(err)
          return
        }
        if (!results || !Array.isArray(results) || results.length === 0) {
          // no region found
          return
        }

        const region = results[0]
        // coordinates, mapCenter
        const mapCenter = {lat: 0.0, lng: 0.0}
        const coordinates = {
          center: {
            lat: parseFloat(region.lat),
            lng: parseFloat(region.lon)
          },
          bbox: {
            _southWest: {
              lat: region.boundingbox[0],
              lng: region.boundingbox[2]
            },
            _northEast: {
              lat: region.boundingbox[1],
              lng: region.boundingbox[3]
            }
          }
        }

        // console.log("on move end set region")
        dispatch(Actions.onMoveend(coordinates, mapCenter))
      })
    },

  setCurrentEntry: (id, center) =>
    (dispatch, getState) => {
      dispatch(Actions.highlight(id ? [id] : []));
      if(id && center && center.lat && center.lng){
        dispatch(Actions.setZoom(mapConst.ENTRY_DEFAULT_ZOOM));
        dispatch(Actions.setCenter(center));
      } else if (id) {
        dispatch(Actions.setCenter(id));
      }
      dispatch({
        type: T.SET_CURRENT_ENTRY,
        payload: id,
      });
    },

  editCurrentEntry: () =>
    (dispatch, getState) => {
      const currentEntry = getState().server.entries[getState().search.current]
      dispatch({
        type: T.EDIT_CURRENT_ENTRY,
        payload: currentEntry
      });
    },

  // tags are comma joint string
  setTags: (tags) =>
    (dispatch) => (
      dispatch({
        type: T.SET_TAGS,
        payload: tags
      })
    ),

  // set categories on the editing dropdown
  setCategory: (category) =>
    (dispatch) => {
      const categoryIdArray = Object.keys(C.NAMES).filter(k => C.NAMES[k] === category)
      const categoryId = categoryIdArray.length ? categoryIdArray[0] : C.IDS.EVENT

      return dispatch({
        type: T.SET_CATEGORY,
        payload: categoryId
      })
    },

  updateStateFromURL: (hash) => {
    return {
      type: T.UPDATE_STATE_FROM_URL,
      payload: hash
    }
  },

  setCenterInUrl: (center) => {
    return {
      type: T.SET_CENTER_IN_URL,
      payload: center
    }
  },

  highlight: (id) => {
    if (id == null) {
      id = [];
    }
    if (!Array.isArray(id)) {
      id = [id];
    }
    return {
      type: T.HIGHLIGHT_ENTRIES,
      payload: id
    };
  },

  showOwnPosition: () =>
    (dispatch) => {
      dispatch({
        type: T.SHOW_OWN_POSITION
      });
      GeoLocation.getLocation((position) => {
        dispatch({
          type: T.OWN_POSITION_RESULT,
          payload: position
        });
      });
    },

  showOwnPosition15minutes: () =>
    (dispatch) => {
      dispatch({
        type: T.SHOW_OWN_POSITION
      });
      GeoLocation.getLocation(((position) => {
        dispatch({
          type: T.OWN_POSITION_RESULT,
          payload: position
        });
      }), 900000);
    },

  cancelOwnPosition: () => {
    return {
      type: T.CANCEL_OWN_POSITION
    };
  },

  showFeatureToDonate: (feat) => {
    return {
      type: T.SHOW_FEATURE_TO_DONATE,
      payload: feat
    };
  },

  showMap: () => {
    return {
      type: T.SHOW_MAP
    }
  },

  showResultList: () => {
    return {
      type: T.SHOW_SEARCH_RESULTS
    }
  },

  explainRatingContext: (context) => {
    return {
      type: T.EXPLAIN_RATING_CONTEXT,
      payload: context
    }
  },

  onMoveend: (coordinates, mapCenter) =>
    (dispatch, getState) => {
      // console.log("called on move end map center: ", mapCenter)
      // console.log("called on move end coordinates: ", coordinates)

      dispatch(serverActions.Actions.setSearchTime(Date.now()));

      if(mapCenter.lat.toFixed(4) !== coordinates.center.lat.toFixed(4) && mapCenter.lng.toFixed(4) !== coordinates.center.lng.toFixed(4)){
        // debugger
        dispatch(Actions.setCenter({
          lat: coordinates.center.lat,
          lng: coordinates.center.lng
        }));
      }
      dispatch(Actions.setBbox(coordinates.bbox));
      dispatch(serverActions.Actions.search());

    },

  onZoomend: (coordinates, zoom) =>
    (dispatch, getState) => {
      dispatch(serverActions.Actions.setSearchTime(Date.now()));

      if(coordinates.zoom !== zoom){
        dispatch(Actions.setZoom(coordinates.zoom));
      }
    }
};

module.exports = Actions;
