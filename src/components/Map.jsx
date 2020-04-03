import React, { Component, Fragment }     from "react"
import {connect}                from "react-redux"
import { icons }                from "vm-leaflet-icons"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { translate } from "react-i18next";
import Actions                   from "../Actions"
import URLs                     from "../constants/URLs"
import { IDS }                  from  "../constants/Categories"
import STYLE                    from "./styling/Variables"
import { avg_rating_for_entry } from "../rating_groups"
import styled                   from "styled-components";
import T                        from "prop-types";
import { FontAwesomeIcon }      from '@fortawesome/react-fontawesome'
import { Fab, Action as ActionButon } from 'react-tiny-fab'
import ReactTooltip from        'react-tooltip'
import { Map, TileLayer, Marker, CircleMarker, Tooltip } from "react-leaflet"

import  "leaflet/dist/leaflet.css"
import 'react-tiny-fab/dist/styles.css'

const { INITIATIVE, EVENT, COMPANY } = IDS;

class KVMMap extends Component {

  getIconById(id) {
    switch (id) {
      case INITIATIVE:
        return icons.initiative;
      case EVENT:
        return icons.event;
      case COMPANY:
        return icons.company;
      default:
        return icons.unknown;
    }
  }

  getCategoryColorById(id){
    switch (id) {
      case INITIATIVE:
        return STYLE.initiative;
      case EVENT:
        return STYLE.event;
      case COMPANY:
        return STYLE.company;
      default:
        return STYLE.otherCategory;
    }
  }

  componentDidMount(){
    //workaround due to a bug in react-leaflet:
    const map = this.refs.map;
    if (map) {
      //map.fireLeafletEvent('load', map)
      map.leafletElement.addControl(L.control.zoom({position: 'bottomright'}))
      this.props.onMoveend(this.getMapCoordinates())
    }

    this.props.fetchProminentTags()
    this.props.fetchTags()
  }

  getMapCoordinates(){
    const m = this.refs.map.leafletElement
    return {
      center: m.getCenter(),
      bbox  : m.getBounds(),
      zoom  : m.getZoom()
    }
  }

  render() {
    const {showNotification, showEmbedModal, t} = this.props;
    const url = window.location.href

    var markers = [];

    const {
      entries,
      center,
      zoom,
      marker,
      onMoveend,
      onZoomend,
      onClick,
      onMarkerClick,
      ratings,
      showLocateButton,
      highlight
    } = this.props;

    if (entries && entries.length > 0 ) {
      entries.forEach(e => {
        let avg_rating = null;

        if (e.lat && e.lng) {

          if(e.ratings && e.ratings.length > 0 && Object.keys(ratings).length > 0){
            const ratings_for_entry = (e.ratings || []).map(id => ratings[id]);
            avg_rating = avg_rating_for_entry(ratings_for_entry);
          }

          if((e.ratings && e.ratings.length > 0 && avg_rating && avg_rating > 0)
            || e.categories[0] === EVENT){
            let opacity = 0.5;
            if(highlight.indexOf(e.id) == 0 || highlight.length == 0) opacity = 1;
            if( marker ) opacity = 0.3;
            markers.push(
              <Marker
                key       = { e.id }
                onClick   = { () => { onMarkerClick(e.id) }}
                position  = {{ lat: e.lat, lng: e.lng }}
                icon      = { this.getIconById(e.categories[0]) }
                opacity   = { opacity }
              >
                <SmallTooltip direction='bottom' offset={[0, 2]}><h3>{e.title}</h3></SmallTooltip>
              </Marker>
            );
          } else {
            // to make clicking the circle easier add a larger circle with 0 opacity:

            let opacity = 0.5;
            if(highlight.indexOf(e.id) == 0 || highlight.length == 0) opacity = 1;
            if( marker ) opacity = 0.3;


            markers.push(
              <CircleMarker
                onClick   = { () => { onMarkerClick(e.id) }}
                key       = { e.id }
                center    = {{ lat: e.lat, lng: e.lng }}
                opacity   = { 1 }
                radius    = { 9 }
                color     = { "#fff" }
                weight    = { 0.7 }
                fillColor = { this.getCategoryColorById(e.categories[0]) }
                fillOpacity = { opacity }
              >
                <SmallTooltip direction='bottom' offset={[0, 10]}><h3>{e.title}</h3></SmallTooltip>
              </CircleMarker>
            );
          }

          if(highlight.length > 0 && highlight.indexOf(e.id) == 0){

            let yOffset = 10
            if(e.ratings && e.ratings.length > 0 && avg_rating && avg_rating > 0) yOffset = 2

            markers.push(
              <CircleMarker
                onClick   = { () => { onMarkerClick(e.id) }}
                key       = { e.id + "-highlight"}
                center    = {{ lat: e.lat, lng: e.lng }}
                opacity   = { 0 }
                fillOpacity = { 0 }
              >
                <SmallTooltip permanent={true} direction='bottom' offset={[0, yOffset]}><h3>{e.title}</h3></SmallTooltip>
              </CircleMarker>);
          }
        }
      });
    }

    let attribution = ""
    URLs.TILE_SERVER_ATTR.name ? attribution = '<a class="osm attr" href=' + URLs.TILE_SERVER_ATTR.link + '>' + URLs.TILE_SERVER_ATTR.name + '</a> | '  : null
    attribution += '&copy; <a class="osm attr" href=' + URLs.OSM_ATTR.link + '>' + URLs.OSM_ATTR.name + '</a>'

    return (
      <Wrapper>
        <Map
          ref         = 'map'
          center      = { center }
          zoom        = { zoom }
          zoomSnap    = { 1.0 }
          zoomControl = { false }
          className   = "map"
          worldCopyJump = { true }
          onMoveend   = { (e) => { onMoveend(this.getMapCoordinates()) }}
          onZoomend   = { (e) => { onZoomend(this.getMapCoordinates()) }}
          onClick     = { (e) => { onClick(e) }} >

          <TileLayer
            url = { URLs.TILE_SERVER.link }
            attribution = { attribution }
          />
          { markers }
          { marker
            ? <Marker position = { marker } icon = { this.getIconById(parseInt(this.props.category)) } />
            : null
          }
          }
        </Map>
        <Fab
          event="click"
          icon={
            <ShareIcon data-tip={t('share')} data-for="shareButton" icon="share-square" color="black"/>
          }
          position={{bottom: 116, right: -23, zIndex: 0}}
          mainButtonStyles={{
            width: 30, height: 30, borderRadius: "4px", background: "#fff"
          }}
        >
          <div style={{paddingTop: 10}}>
            <CopyToClipboard text={url}>
              <ActionButon
                onClick={() => showNotification(t('growler.linkCopied'), "success")}
                style={{
                  backgroundColor: 'white',
                  height: 30,
                  width: 90,
                  borderRadius: "4px",
                  marginRight: 8,
                  color: "black",
                }}
              >
                <ActionIcon icon="link" color="black"/>
                <div><ActionText>{t('copy')}</ActionText></div>
              </ActionButon>
            </CopyToClipboard>
          </div>
          <div style={{paddingTop: 30}}>
            <ActionButon
              onClick={() => showEmbedModal()}
              style={{
                backgroundColor: 'white',
                height: 30,
                width: 90,
                borderRadius: "4px",
                marginRight: 8,
                color: "black",
              }}
            >
              <ActionIcon icon="code" color="black"/>
              <div><ActionText>Embed</ActionText></div>
            </ActionButon>
          </div>
        </Fab>
        <ReactTooltip id="shareButton" type="light" place="left" effect="solid"/>
        {showLocateButton ?
          <div className="leaflet-control-container">
            <LocateButtonContainer className="leaflet-right">
              <LocateButtonInnerContainer className = "leaflet-control-locate leaflet-bar leaflet-control">
                <LocateButton
                  className   = "leaflet-bar-part leaflet-bar-part-single" //"locate-icon"
                  onClick     = { this.props.onLocate }
                  title       = "Zeige meine Position" >
                  <LocateIcon icon="location-arrow" />
                </LocateButton>
              </LocateButtonInnerContainer>
            </LocateButtonContainer>
          </div>
          : null }
      </Wrapper>)
  }
}

KVMMap.propTypes = {
  entries       : T.array,
  ratings       : T.object,
  highlight     : T.array,
  center        : T.object,
  zoom          : T.number,
  marker        : T.object,
  onClick       : T.func,
  onMoveend     : T.func,
  onZoomend     : T.func,
  onMarkerClick : T.func,
  onLocate      : T.func,
  showLocateButton : T.bool
};

const mapDispatchToProps = (dispatch) => ({
  showNotification: (message, status) => (dispatch(Actions.showNotification(message, status))),
  showEmbedModal: () => (dispatch(Actions.showEmbedModal())),
  fetchTags: () => (dispatch(Actions.fetchTags())),
  fetchProminentTags: () => (dispatch(Actions.fetchProminentTags()))
})

module.exports = connect(null, mapDispatchToProps)(translate('translation')(KVMMap));

const Wrapper = styled.div`

  div.map {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0;
    z-index: 0;
    padding: 0;
    top: 0;
    left: 0;
  }
  .osm.attr, .leaflet-control-attribution.leaflet-control a {
    color: ${ STYLE.darkGray }
  }
`;

const LocateButtonContainer = styled.div`
  bottom: 95px;
  position: absolute;
  z-index: 0;
`;

const LocateButtonInnerContainer = styled.div`
  box-shadow: none !important;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0,0,0,0.2);
  background-clip: padding-box;
`;

const LocateButton = styled.a `
  cursor: pointer;
  font-size: 14px;
  color: #333;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
`;

const ShareIcon = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
`
const ActionIcon = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
  color: "black";
  margin-right: 5px;
`

const ActionText = styled.span`
  font-size: 0.75rem;
`

const LocateIcon = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
`;

const SmallTooltip = styled(Tooltip)`
  > h3 {
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
  }
`
