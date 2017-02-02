import isEmail from 'validator/lib/isEmail';
import isBase64 from 'validator/lib/isBase64';

function inheritToFrom (type, inherited) {
  type.prototype = Object.create(inherited.prototype);
}

export const Email = (value) => {
  return isEmail(value.trim());
};
inheritToFrom(Email, String);

export const Enum = (values = []) => {
  if (!Array.isArray(values)) {
    values = values.split('|');
  }

  function _Enum(value) {
    return values.indexOf(value.trim()) > -1;
  };
  inheritToFrom(_Enum, String);

  return _Enum;
};

export const Base64 = (value) => {
  return isBase64(value.trim());
};
inheritToFrom(Base64, String);

const dataURIRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

export const DataURI = (value) => {
  return dataURIRegex.test(value.trim());
};
inheritToFrom(DataURI, String);
