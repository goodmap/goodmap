import "typeface-rubik/index.css"
import React        from "react";
import ReactDOM     from "react-dom";
import WebAPI       from "../../WebAPI";
import parseUrl     from "../../util/parseUrl";
import MapComponent from "./map";
import mapConst     from "../../constants/Map";
import { NUM_ENTRIES_TO_FETCH } from "../../constants/Search";
import Categories   from "../../constants/Categories";

const rootElement = document.querySelector('#app');

const flatten = nestedArray => nestedArray.reduce(
  (a, next) => a.concat(Array.isArray(next) ? flatten(next) : next), []
);

let state = {
  searchString: null,
  currentEntry: null,
  entries: [],
  entriesById: {},
  zoom: mapConst.DEFAULT_ZOOM,
  center: mapConst.DEFAULT_CENTER,
  bbox: null,
  categories: [Categories.IDS.INITIATIVE, Categories.IDS.COMPANY],
  orgTag: null,
};

const render = () => {
  const emptyFunction = () => {};

  const onMoveend = (coordinates) => {
    state.bbox = coordinates.bbox;
  };

  const highlight = state.currentEntry ? [state.currentEntry.id] : [];

  ReactDOM.render(MapComponent({marker: null, size: 2, center: state.center, 
    zoom: state.zoom, category: null, highlight: highlight, 
  entries: state.entries, onClick: emptyFunction , onMarkerClick: emptyFunction, 
  onMoveend: onMoveend, onZoomend: emptyFunction, loggedIn: false}), rootElement);
};

const search = () => {
  const s = state.searchString;
  const cats = state.categories;
  const sw = state.bbox._southWest;
  const ne = state.bbox._northEast;
  const bbox = [sw.lat, sw.lng, ne.lat, ne.lng];
  const {orgTag} = state

  if (!cats.length < 1 && (s == null || !s.trim().endsWith("#"))) {
    WebAPI.searchEntries(s, cats, bbox, orgTag, (err, res) => {
      if ((Array.isArray(res.visible)) && res.visible.length > 0) {
        const ids = res.visible.map(e => e.id)
          .slice(0, NUM_ENTRIES_TO_FETCH);
        WebAPI.getEntries(ids, orgTag, (entriesErr, entriesRes) => {
          if(!entriesErr && entriesRes.length > 0) {
            state.entries = entriesRes;
            render();
          }
        });        
      }
    });
  }
}

const { params } = parseUrl(window.location.href);
const {
  entry: entryId,
  search: tagsStr,
  zoom: zoomStr,
  center: centerStr,
  orgTag
} = params

state.orgTag = orgTag

if(zoomStr){
  state.zoom = parseFloat(zoomStr);
}
if(params && Object.keys(params).length != 0){
  if(entryId){ 
    state.zoom = mapConst.ENTRY_DEFAULT_ZOOM;
    WebAPI.getEntries([entryId], orgTag, (err, res) => {
      state.entries = {};
      if(!err && res.length > 0) {
        state.entries = res;

        state.entriesById = {};
        if (Array.isArray(res)) {
          res.filter(e => e != null)
           .forEach(e => { state.entriesById[e.id] = e; });
        } else {
          state.entriesById[res.id] = res;
        }
        state.currentEntry = state.entriesById[entryId];
        state.center = {
          lat: state.currentEntry.lat,
          lng: state.currentEntry.lng
        };
        render();
      }
    });
  } else {
    if (centerStr && centerStr.includes(',') && (centerStr.length >= 3)) {
      state.center = {
        lat: parseFloat(centerStr.split(',')[0]),
        lng: parseFloat(centerStr.split(',')[1])
      };
    }
    if (search || tags || search == "" || tags == "") {
      state.searchString = searchStr || "";
      render(); // necessary to make leaflet define the bbox
      search();
    }
  }
}

render();
