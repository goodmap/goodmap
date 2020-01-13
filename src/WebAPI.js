import request from "superagent/lib/client";
import saPrefix from "superagent-prefix";
import { TILEHOSTING_API_KEY } from "./constants/App";
import { OFDB_API, TH_GEOCODER, NOMINATIM } from "./constants/URLs"
import CATEGORY_IDS from "./constants/Categories";

const prefix = saPrefix(OFDB_API.link);
const FALANSTER_TOKEN = 'eyJzdWIiOiJtYXBhLWZhbGFuc3RlciIsIm5hbWUiOiJmYWxhbn';

const jsonCallback = (cb) => (err, res) => {
  if (err) {
    cb(err);
  } else {
    cb(null, res.body);
  }
};

function normalizeCoordinate(bbox, idx) {
    if (bbox.length > idx && bbox[idx] && (!isNaN(bbox[idx])) && bbox[idx] > 180) {
        bbox[idx] = ((bbox[idx] + 180.0) % 360.0) - 180.0;
    }
    if (bbox.length > idx && bbox[idx] && (!isNaN(bbox[idx])) && bbox[idx] < -180) {
        bbox[idx] = ((bbox[idx] - 180.0) % 360.0) + 180.0;
    }
}

module.exports = {

  searchEntries: (txt, cats, bbox, cb) => {

    if (txt == null) {
      txt = '';
    }
    if (cats == null) {
      cats = [];
    }
    if (bbox == null) {
      bbox = [];
    }
    normalizeCoordinate(bbox, 1);
    normalizeCoordinate(bbox, 3);
    request
      .get('/search')
      .use(prefix)
      .query({
        text: txt.trim()
      })
      .query((cats.length > 0) ? ('categories=' + cats.join(',')) : "")
      .query('bbox=' + bbox.join(','))
      .set('Accept', 'application/json')
      .end(jsonCallback(cb));
  },

  searchEvents: (txt, bbox, start, end, cb) => {
    if (bbox == null) {
      bbox = [];
    }
    normalizeCoordinate(bbox, 1);
    normalizeCoordinate(bbox, 3);
    let req = request
      .get('/events')
      .use(prefix)
      .set('Accept', 'application/json');
    if(bbox && bbox.length > 0) req.query('bbox=' + bbox.join(','))
    if(txt && txt.length > 0) req.query({text: txt.trim()})
    if(start) req.query(start ? ('start_min=' + start) : "")
    if(end) req.query(end ? ('start_max=' + end) : "")

    req.end(jsonCallback(cb));
  },

  createNewEvent: (newEvent, callBack) => {
    request
      .post('/events')
      .use(prefix)
      .set({ 'Accept': 'application/json', 'Authorization': `Bearer ${ FALANSTER_TOKEN }` })
      .send(newEvent)
      .end((err, res) => {
        if (err) {
          callBack(err);
        } else {
          callBack(null, res.text.replace(/"/g, ""));
        }
      });
  },

  editEvent: (event, callBack) => {
    request
      .put('/events/' + event.id)
      .use(prefix)
      .set({ 'Accept': 'application/json', 'Authorization': `Bearer ${ FALANSTER_TOKEN }` })
      .send(event)
      .end((err, res) => {
        if (err) {
          callBack(err);
        } else {
          callBack(null, res.text);
        }
      });
  },

  getEvent: (ids = [], cb) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    if (ids.length < 1) {
      cb(new Error("no IDs were passed"));
    } else {
      request
        .get('/events/' + ids.join(','))
        .use(prefix)
        .set('Accept', 'application/json')
        .end(jsonCallback(cb));
    }
  },

  searchAddressTilehosting: (addr, cb) => {
    let query = TH_GEOCODER.link.replace("<query>", addr).replace("<key>", TILEHOSTING_API_KEY);
    if (addr != null && addr != "") {
      request
        .get(query)
        .set('Accept', 'application/json')
        .end(jsonCallback(cb));
    }
  },

  searchAddressNominatim: (addr, cb) => {
    if (addr == null) {
      addr = '';
    }
    request
      .get('/search')
      .use(saPrefix(NOMINATIM.link))
      .query({
        q: addr
      })
      .query({
        format: 'json'
      })
      .query({
        addressdetails: 1
      })
      .set('Accept', 'application/json')
      .end(jsonCallback(cb));
  },

  searchGeolocation: (latlng, cb) => {

    if (latlng == null) {
      latlng = {
        lat: 0.0,
        lng: 0.0
      };
    }

    request
      .get('/reverse')
      .use(saPrefix(NOMINATIM.link))
      .query({
        lat: latlng.lat
      })
      .query({
        lon: latlng.lng
      })
      .query({
        zoom: 18
      })
      .query({
        format: 'json'
      })
      .query({
        addressdetails: 1
      })
      .set('Accept', 'application/json')
      .end(jsonCallback(cb));
  },

  getEntries: (ids = [], cb) => {

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    if (ids.length < 1) {
      cb(new Error("no IDs were passed"));
    } else {
      request
        .get('/entries/' + ids.join(','))
        .use(prefix).set('Accept', 'application/json')
        .end(jsonCallback(cb));
    }
  },

  getRatings: (ids = [], cb) => {

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    if (ids.length < 1) {
      cb(new Error("no IDs were passed"));
    } else {
      request
        .get('/ratings/' + ids.join(','))
        .use(prefix).set('Accept', 'application/json')
        .end(jsonCallback(cb));
    }
  },

  saveNewEntry: (e, cb) => {
    request
      .post('/entries/')
      .use(prefix)
      .set('Accept', 'application/json')
      .send(e)
      .end((err, res) => {
        if (err) {
          cb(err);
        } else {
          cb(null, res.text.replace( /"/g ,""));
        }
      });
  },

  saveEntry: (e, cb) => {
    request
      .put('/entries/' + e.id)
      .use(prefix)
      .set('Accept', 'application/json')
      .send(e)
      .end((err, res) => {
        if (err) {
          cb(err);
        } else {
          cb(null, res.text);
        }
      });
  },

  createRating: (r, cb) => {
    request
      .post('/ratings/')
      .use(prefix)
      .set('Accept', 'application/json')
      .send(r)
      .end((err, res) => {
        if (err) {
          cb(err);
        } else {
          cb(null, res.text);
        }
      });
  },

  getAllCategories: (cb) => {
    request
      .get('/categories/')
      .use(prefix)
      .set('Accept', 'application/json')
      .end(cb);
  },

  getServerInfo: (cb) => {
    request
      .get('/server/version')
      .set('Accept', 'application/json')
      .use(prefix)
      .end((err, res) => {
        if (err) {
          cb(err);
        } else {
          cb(null, {
            version: res.text
          });
        }
      });
  },

  register: ({
    email,
    password,
  }, cb) => {
    request
      .post('/users')
      .use(prefix)
      .set('Accept', 'application/json')
      .send({
        email,
        password
      })
      .end(cb);
  },

  login: ({
    email,
    password
  }, cb) => {
    request
      .post('/login')
      .set('Accept', 'application/json')
      .use(prefix)
      .withCredentials()
      .send({
        email,
        password
      })
      .end(cb);
  },

  getUser: (email, cb) => {
    request
      .get('/users/' + email)
      .set('Accept', 'application/json')
      .use(prefix)
      .withCredentials()
      .end(cb);
  },

  logout: (cb) => {
    request
      .post('/logout')
      .set('Accept', 'application/json')
      .use(prefix)
      .withCredentials()
      .end(cb);
  },

  confirmEmail: (token, cb) => {
    request
      .post('/confirm-email-address')
      .set('Accept', 'application/json')
      .use(prefix)
      .send({
        token
      })
      .end(cb);
  },

  deleteAccount: (email, cb) => {
    request
      .delete('/users/' + email)
      .set('Accept', 'application/json')
      .use(prefix)
      .withCredentials()
      .end(cb);
  },

  subscribeToBbox: (bbox, cb) => {
    let coordinates = [bbox._southWest, bbox._northEast];
    request
      .post('/subscribe-to-bbox')
      .use(prefix)
      .set('Accept', 'application/json')
      .send(coordinates)
      .end((err, res) => {
        if (err) {
          cb(err);
        } else {
          cb(null, res.text);
        }
      });
  },

  getBboxSubscriptions: (cb) => {
    request
      .get('/bbox-subscriptions')
      .set('Accept', 'application/json')
      .use(prefix)
      .end(cb);
  },

  unsubscribeFromBboxes: (cb) => {
    request
      .delete('/unsubscribe-all-bboxes')
      .set('Accept', 'application/json')
      .use(prefix)
      .end(cb);
  }
};
