Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('material-ui/styles/colors');

var _colorManipulator = require('material-ui/utils/colorManipulator');

var _spacing = require('material-ui/styles/spacing');

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  spacing: _spacing2.default,
  fontFamily: 'Roboto, sans-serif',
  avatar: {
    backgroundColor: _colors.grey200,
    color: _colors.lightBlue700
  },
  BottomNavigation: {
    backgroundColor: '#212121',
    unselectedColor: _colors.grey500,
  },
  FlatButton: {
    textColor: _colors.fullWhite
  },
  palette: {
    primary1Color: '#fff',
    primary2Color: _colors.lightBlue700,
    primary3Color: _colors.grey500,
    accent1Color: _colors.lightBlue900,
    accent2Color: '#262626',
    accent3Color: _colors.blueGrey400,
    textColor: _colors.fullWhite,
    secondaryTextColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.7),
    alternateTextColor: _colors.fullWhite,
    canvasColor: _colors.fullBlack,
    borderColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3),
    disabledColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3),
    pickerHeaderColor: (0, _colorManipulator.fade)(_colors.fullBlack, 0.12),
    clockCircleColor: (0, _colorManipulator.fade)(_colors.fullBlack, 0.12)
  },
  raisedButton: {
    primaryColor: _colors.lightBlue900,
    disabledColor: _colors.grey700
  },
  slider: {
    trackColor: _colors.grey500,
    trackColorSelected: _colors.grey500,
    handleColorZero: _colors.lightBlue900,
    selectionColor: _colors.lightBlue900
  },
  tabs: {
    backgroundColor: "#424242",
    color: _colors.fullWhite,
  },
  textField: {
    textColor: _colors.fullWhite
  }

};
