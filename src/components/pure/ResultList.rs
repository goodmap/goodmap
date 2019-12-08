use crate::{components::pure::CityList, entities::*, Mdl, Msg};
use seed::prelude::*;

// TODO: import { translate }        from "react-i18next";
// TODO: import Flower               from "../Flower";
// TODO: import NavButton            from "./NavButton";
// TODO: import EventTimes           from "./EventTimes";
// TODO: import i18n                 from "../../i18n";
// TODO: import { NAMES, IDS }       from "../../constants/Categories"
// TODO: import STYLE                from "../styling/Variables"
// TODO: import ScrollableDiv        from "./pure/ScrollableDiv";

pub fn view(mdl: &Mdl) -> Node<Msg> {
    let group_header_style = style! {
    // TODO:   border-top: 3px solid ${STYLE.lightGray};
    // TODO:   padding: 0.5em 1em 0.5em 1em;
    // TODO:   margin: 0;
    // TODO:   background: #eaeaea;
    // TODO:   color: #666;
    };

    div![
        id! {"results"},
        // TODO:
        // TODO: const ResultWrapper = styled(ScrollableDiv)`
        style! {
        // TODO: background: #f7f7f7;
        // TODO:
        // TODO:  /* city list only for sidebar, not landing page TODO: where to put this? */
        // TODO: .city-list ul {
        // TODO:   background: #f7f7f7;
        // TODO:   li {
        // TODO:     padding: 0.2em;
        // TODO:     padding-left: 0.7em;
        // TODO:     padding-right: 0.7em;
        // TODO:     line-height: 0.9;
        // TODO:     border-left: 5px solid transparent;
        // TODO:     &:hover {
        // TODO:       background: #fff;
        // TODO:       border-left: 5px solid ${STYLE.darkGray};
        // TODO:       div.chevron {
        // TODO:         color: ${STYLE.darkGray};
        // TODO:       }
        // TODO:     }
        // TODO:     span {
        // TODO:       &.state {
        // TODO:         color: #555;
        // TODO:       }
        // TODO:       &.country {
        // TODO:         color: #888;
        // TODO:       }
        // TODO:       &.prefix {
        // TODO:         color: #888;
        // TODO:       }
        // TODO:     }
        // TODO:   }
        },
        result_list(&mdl),
        if !mdl.search.cities.is_empty() {
            div![
                div![
                    &group_header_style,
                    // TODO: { t("search-results.cities") }
                ],
                CityList::view(&mdl)
            ]
        } else {
            empty!()
        },
        if !mdl.search.invisible.is_empty() {
            div![
                div![
                    &group_header_style,
                    // TODO:  { t("search-results.results-out-of-bbox") }
                ],
                // TODO: <ResultList
                // TODO:   entries={ invisibleEntries }
                // TODO:   ratings={ ratings }
                // TODO:   highlight={ search.highlight }
                // TODO:   onClick={ (id,center) => { return dispatch(Actions.setCurrentEntry(id, center)); }}
                // TODO:   onMouseEnter={ id => { return dispatch(Actions.highlight(id)); }}
                // TODO:   onMouseLeave={ id => { return dispatch(Actions.highlight()); }}
                // TODO:   dispatch={ dispatch }
                // TODO:   waiting={ waiting_for_search_results }
                // TODO:   moreEntriesAvailable={ search.moreEntriesAvailable }
                // TODO:   onMoreEntriesClick={ () => { return dispatch(Actions.showAllEntries()); }}
                // TODO: />
            ]
        } else {
            empty!()
        }
    ]
}

pub fn result_list(mdl: &Mdl) -> Node<Msg> {
    // TODO:   const { entries, ratings, highlight, onClick, moreEntriesAvailable, onMoreEntriesClick} = props
    // TODO:   entries={ resultEntries }
    // TODO:   ratings={ ratings }
    // TODO:   onMoreEntriesClick={ () => { return dispatch(Actions.showAllEntries()); }}
    // TODO:   dispatch={dispatch}

    // TODO:   highlight={ search.highlight}
    let moreEntriesAvailable = mdl.search.moreEntriesAvailable;

    let results = mdl
        .search
        .entryResults
        .iter()
        .map(|e| ResultListElement(e))
        .collect::<Vec<_>>();
    // TODO:   let results = entries.map( e =>
    // TODO:     <ResultListElement
    // TODO:       entry        = { e            }
    // TODO:       ratings      = { (e.ratings || []).map(id => ratings[id])}
    // TODO:       key          = { e.id         }
    // TODO:       highlight    = { highlight.indexOf(e.id) >= 0 }
    // TODO:       onClick      = { (id, center) => {
    // TODO:         if (center) {
    // TODO:           dispatch(Actions.setCurrentEntry(id, center))
    // TODO:         }
    // TODO:       }}
    // TODO:       onMouseEnter = { (id) => { dispatch(Actions.highlight(e.id)) }}
    // TODO:       onMouseLeave = { (id) => { dispatch(Actions.highlight()) }}
    // TODO:       t            = { t } />);
    // TODO:
    // TODO:   if(moreEntriesAvailable && !waiting){
    // TODO:     results.push(
    // TODO:       <ListElement key="show-more-entries">
    // TODO:         <div>
    // TODO:           <a onClick = { onMoreEntriesClick } href="#">
    // TODO:             {t("resultlist.showMoreEntries")}
    // TODO:           </a>
    // TODO:         </div>
    // TODO:       </ListElement>
    // TODO:     );
    // TODO:   }

    div![
        // TODO: <Wrapper>
        if !results.is_empty() {
            ul![results]
        } else {
            p![if mdl.view.waiting_for_search_results {
                span![
                // TODO: <span>{t("resultlist.entriesLoading")}</span>
                    ]
            } else {
                // TODO: <FontAwesomeIcon icon={['far', 'frown']} />
                span![
                    // TODO: t("resultlist.noEntriesFound")}
                ]
            }]
        }
    ]
}

// TODO: const getTruncatedTitle = (title, maxCharacters) => {
// TODO:   if (title) {
// TODO:     if (title.length > maxCharacters + 5) {
// TODO:       return title.substring(0, maxCharacters) + "...";
// TODO:     } else {
// TODO:       return title;
// TODO:     }
// TODO:   } else {
// TODO:     return "";
// TODO:   }
// TODO: }
// TODO:
// TODO: const getTruncatedDescription = (description, maxCharacters) => {
// TODO:   if(description && description.length > maxCharacters - 10) {
// TODO:     description = description.substring(0, maxCharacters - 29 + description.substring(maxCharacters - 30).indexOf(". ")) + '...';
// TODO:   }
// TODO:   if(description && description.length >  maxCharacters) {
// TODO:     description = description.substring(0, maxCharacters - 29 + description.substring(maxCharacters - 30).indexOf(" ") - 1) + '...';
// TODO:   }
// TODO:   return description;
// TODO: }

fn ResultListElement(e: &EntrySearchResult) -> Node<Msg> {
    // TODO: const ResultListElement = ({highlight, entry, ratings, onClick, onMouseEnter, onMouseLeave, t}) => {
    // TODO:   var css_class = highlight ? 'highlight-entry ' : '';
    // TODO:   css_class = css_class + NAMES[entry.categories && entry.categories[0]];
    // TODO:   const isEvent = (entry.categories && entry.categories[0] === IDS.EVENT);
    // TODO:   const title = getTruncatedTitle(entry.title, 60); // maximally two lines
    // TODO:   const description = getTruncatedDescription(entry.description, 110); // maximally two lines
    // TODO:
    li![
        // TODO: <ListElement
        // TODO:   key           = { entry.id }
        // TODO:   className     = { css_class }
        // TODO:   onClick       = { (ev) => { onClick(entry.id, {lat: entry.lat, lng: entry.lng}) }}
        // TODO:   onMouseEnter  = { (ev) => { ev.preventDefault(); onMouseEnter(entry.id) }}
        // TODO:   onMouseLeave  = { (ev) => { ev.preventDefault(); onMouseLeave(entry.id) }} >
        // TODO:   <OuterWrapper>
        // TODO:     <TitleCategoryDescriptionsAndFlower>
        // TODO:       <TitleCategoryAndDescription>
        // TODO:         <span className="category">
        // TODO:           { t("category." + NAMES[entry.categories && entry.categories[0]]) }
        // TODO:         </span>
        // TODO:         <div>
        // TODO:           <EntryTitle id={entry.id} className="title">{title}</EntryTitle>
        e.title // TODO:         </div>
                // TODO:         { getBody(isEvent, description, entry.city, entry.organizer) }
                // TODO:       </TitleCategoryAndDescription>
                // TODO:       { !isEvent ?
                // TODO:         <FlowerWrapper>
                // TODO:           <Flower ratings={ratings} radius={30} showTooltip={false}/>
                // TODO:         </FlowerWrapper>
                // TODO:       : <EventTimeLabel start={ entry.start }/> }
                // TODO:     </TitleCategoryDescriptionsAndFlower>
                // TODO:     {
                // TODO:       entry.tags && !isEvent && (entry.tags.length > 0)
                // TODO:         ? <TagsWrapper>
                // TODO:           <ul >
                // TODO:             { entry.tags.slice(0, 5).map((t, index) => (t !== '') ? <Tag key={index}>#{t}</Tag> : null) }
                // TODO:           </ul>
                // TODO:         </TagsWrapper>
                // TODO:         : null
                // TODO:     }
                // TODO:   </OuterWrapper>
                // TODO: </ListElement>)
    ]
}

// TODO: const getBody = (isEvent, description, city, organizer) => {
// TODO:   if (isEvent) {
// TODO:     return (
// TODO:       <EventBody>
// TODO:         <div>{city}</div>
// TODO:         <div>{organizer}</div>
// TODO:       </EventBody>
// TODO:     );
// TODO:   } else {
// TODO:     return (<Description>{description}</Description>);
// TODO:   }
// TODO: }

// TODO: const OuterWrapper = styled.div`
// TODO:   display: flex;
// TODO:   flex-direction: column;
// TODO:   height: 100%;
// TODO: `
// TODO:
// TODO: const TitleCategoryDescriptionsAndFlower = styled.div`
// TODO:   flex-grow: 1;
// TODO:   display: flex;
// TODO:   flex-direction: row;
// TODO:   overflow-y: hidden;
// TODO: `
// TODO:
// TODO: const TitleCategoryAndDescription = styled.div`
// TODO:   flex-grow: 1;
// TODO:   display: flex;
// TODO:   flex-direction: column;
// TODO: `
// TODO:
// TODO: const EventTimeLabel = (props) => {
// TODO:   const { start } = props;
// TODO:   return (<EventTimeWrapper><EventTimes start={ start } showTimes={ false }/></EventTimeWrapper>)
// TODO: }
// TODO:
// TODO: const EventTimeWrapper = styled.div`
// TODO:   margin: 12px 7px 10px 10px;
// TODO: `
// TODO:
// TODO: const EntryTitle = styled.h3`
// TODO:   font-size: 1.1em;
// TODO:   margin: .2rem .3em .2rem 0;
// TODO:   font-weight: 500;
// TODO:   position: relative;
// TODO:   z-index: 3;
// TODO: `;
// TODO:
// TODO: const ListElement = styled.li `
// TODO:   position: relative;
// TODO:   height: 115px;
// TODO:   overflow-y: hidden;
// TODO:   cursor: pointer;
// TODO:   margin: 0;
// TODO:   padding-left: 0.7em;
// TODO:   padding-top: 0.7em;
// TODO:   padding-right: 0.5em;
// TODO:   padding-bottom: 0.4em;
// TODO:   border-bottom: 1px solid #ddd;
// TODO:   border-left: 5px solid transparent;
// TODO:   div {
// TODO:     &.category {
// TODO:       height: 1.2em;
// TODO:     }
// TODO:   }
// TODO:   &.current-entry {
// TODO:     background: #fff;
// TODO:   }
// TODO:   &:hover {
// TODO:     background: #fff;
// TODO:   }
// TODO:   &.event {
// TODO:     &.current-entry {
// TODO:       border-left: 5px solid ${STYLE.event};
// TODO:     }
// TODO:     &:hover {
// TODO:       border-left: 5px solid ${STYLE.event};
// TODO:     }
// TODO:     span.category {
// TODO:       color: ${STYLE.event};
// TODO:     }
// TODO:   }
// TODO:   &.company {
// TODO:     &.current-entry {
// TODO:       border-left: 5px solid ${STYLE.company};
// TODO:     }
// TODO:     &:hover {
// TODO:       border-left: 5px solid ${STYLE.company};
// TODO:     }
// TODO:     span.category {
// TODO:       color: ${STYLE.company};
// TODO:     }
// TODO:   }
// TODO:   &.initiative {
// TODO:     &.current-entry {
// TODO:       border-left: 5px solid ${STYLE.initiative};
// TODO:     }
// TODO:     &:hover {
// TODO:       border-left: 5px solid ${STYLE.initiative};
// TODO:     }
// TODO:     span.category {
// TODO:       color: ${STYLE.initiative};
// TODO:     }
// TODO:   }
// TODO:   span {
// TODO:     &.category {
// TODO:       font-size: 0.8em;
// TODO:       color: #aaa;
// TODO:       text-transform: uppercase;
// TODO:     }
// TODO:     &.title {
// TODO:       font-weight: bold;
// TODO:       font-size: 1.2em;
// TODO:       margin-right: 0.3em;
// TODO:     }
// TODO:     &.subtitle {
// TODO:       font-size: 0.8em;
// TODO:       color: #555;
// TODO:     }
// TODO:   }
// TODO:   .highlight-entry {
// TODO:     div.chevron {
// TODO:       color: $darkGray;
// TODO:     }
// TODO:     &.initiative div.chevron {
// TODO:       color: $initiative;
// TODO:     }
// TODO:     &.company div.chevron {
// TODO:       color: $company;
// TODO:     }
// TODO:     &.event div.chevron {
// TODO:       color: $event;
// TODO:     }
// TODO:   }
// TODO: `
// TODO:
// TODO: const EventBody = styled.div`
// TODO:   font-size: 0.8em;
// TODO:   margin-top: 2px;
// TODO:   max-height: ${14 * 3}px;
// TODO:   overflow: hidden;
// TODO:   hyphens: auto;
// TODO:   color: #555;
// TODO:   > div {
// TODO:     margin: 1px 0;
// TODO:   }
// TODO: `
// TODO:
// TODO: const Description = styled.div`
// TODO:   margin-top: 2px;
// TODO:   max-height: ${14 * 3}px;
// TODO:   overflow: hidden;
// TODO:   hyphens: auto;
// TODO:   position: relative;
// TODO:   z-index: 3;
// TODO:   font-size: 0.8em;
// TODO:   color: #555;
// TODO: `;
// TODO:
// TODO: const TagsWrapper = styled.div`
// TODO:   height: 21px;
// TODO:   overflow-y: hidden;
// TODO:   margin-top: 5px;
// TODO:   float: left;
// TODO:   ul {
// TODO:     list-style: none;
// TODO:     padding: 0;
// TODO:     margin: 0;
// TODO:   }
// TODO: `
// TODO:
// TODO: const Tag = styled.div `
// TODO:   line-height: 14px;
// TODO:   font-size: 0.75em;
// TODO:   display: inline-block;
// TODO:   background: #eaeaea;
// TODO:   color: #333;
// TODO:   border-radius: 0.3em;
// TODO:   padding: 0.2em 0.4em;
// TODO:   margin-right: 0.4em;
// TODO:   margin-bottom: 0.2em;
// TODO:   border: 0;
// TODO:   letter-spacing: 0.06em;
// TODO:   height: 12px;
// TODO:   overflow: hidden;
// TODO: `
// TODO:
// TODO: const FlowerWrapper = styled.div `
// TODO:   margin: 22px 10px 0 10px;
// TODO: `
// TODO:
// TODO: const Wrapper = styled.div `
// TODO:   box-sizing: border-box;
// TODO:
// TODO:   .result-list {
// TODO:     p {
// TODO:       &.no-results {
// TODO:         margin: 0;
// TODO:         padding: 1em;
// TODO:         font-size: 0.9em;
// TODO:         span {
// TODO:           margin-left: 0.5em;
// TODO:         }
// TODO:       }
// TODO:       &.loading {
// TODO:         margin: 20px 0 0 0;
// TODO:         padding: 1em;
// TODO:         font-size: 0.9em;
// TODO:         span {
// TODO:           margin-left: 0.5em;
// TODO:         }
// TODO:       }
// TODO:     }
// TODO:     ul {
// TODO:       list-style: none;
// TODO:       margin: 0;
// TODO:       padding: 0;
// TODO:
// TODO:     }
// TODO:   }
// TODO: `
