webpackHotUpdate(0,{"./src/containers/Empty/Empty.js":function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(\"./node_modules/react/react.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouterDom = __webpack_require__(\"./node_modules/react-router-dom/es/index.js\");\n\nvar _reactstrap = __webpack_require__(\"./node_modules/reactstrap/dist/reactstrap.es.js\");\n\nvar _Registration = __webpack_require__(\"./src/views/Registration/Registration.js\");\n\nvar _Registration2 = _interopRequireDefault(_Registration);\n\nvar _Authorization = __webpack_require__(\"./src/views/Authorization/Authorization.js\");\n\nvar _Authorization2 = _interopRequireDefault(_Authorization);\n\n__webpack_require__(\"./src/containers/Empty/style.scss\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Empty = function (_Component) {\n    _inherits(Empty, _Component);\n\n    function Empty() {\n        _classCallCheck(this, Empty);\n\n        return _possibleConstructorReturn(this, (Empty.__proto__ || Object.getPrototypeOf(Empty)).apply(this, arguments));\n    }\n\n    _createClass(Empty, [{\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            document.body.classList.remove('sidebar-fixed'); //убираем класс с body чтобы выровнять контентный блок\n            document.addEventListener(\"touchstart\", function () {}, true); //обработчик корректного отображения ontap подсветок на моб-х устройствах\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            return _react2.default.createElement(\n                'div',\n                { className: 'app auth-layer' },\n                _react2.default.createElement(\n                    'div',\n                    { className: 'empty-tmpl-app' },\n                    _react2.default.createElement(\n                        'main',\n                        { className: 'main' },\n                        _react2.default.createElement(\n                            _reactstrap.Container,\n                            { fluid: true },\n                            _react2.default.createElement(\n                                _reactRouterDom.Switch,\n                                null,\n                                _react2.default.createElement(_reactRouterDom.Route, { path: '/registration', name: 'registr', component: _Registration2.default }),\n                                _react2.default.createElement(_reactRouterDom.Route, { path: '/authorization', name: 'authoriz', component: _Authorization2.default })\n                            ),\n                            _react2.default.createElement('div', { className: 'blur_layout' })\n                        )\n                    )\n                )\n            );\n        }\n    }]);\n\n    return Empty;\n}(_react.Component);\n\nexports.default = Empty;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGFpbmVycy9FbXB0eS9FbXB0eS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvY29udGFpbmVycy9FbXB0eS9FbXB0eS5qcz80ZGYxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtTd2l0Y2gsIFJvdXRlfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7Q29udGFpbmVyfSBmcm9tICdyZWFjdHN0cmFwJztcbmltcG9ydCBSZWdpc3RyYXRpb24gZnJvbSAnLi4vLi4vdmlld3MvUmVnaXN0cmF0aW9uL1JlZ2lzdHJhdGlvbi5qcyc7XG5pbXBvcnQgQXV0aG9yaXphdGlvbiBmcm9tICcuLi8uLi92aWV3cy9BdXRob3JpemF0aW9uL0F1dGhvcml6YXRpb24uanMnO1xuaW1wb3J0ICcuL3N0eWxlLnNjc3MnO1xuXG5jbGFzcyBFbXB0eSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzaWRlYmFyLWZpeGVkJyk7IC8v0YPQsdC40YDQsNC10Lwg0LrQu9Cw0YHRgSDRgSBib2R5INGH0YLQvtCx0Ysg0LLRi9GA0L7QstC90Y/RgtGMINC60L7QvdGC0LXQvdGC0L3Ri9C5INCx0LvQvtC6XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uKCl7fSwgdHJ1ZSk7ICAgIC8v0L7QsdGA0LDQsdC+0YLRh9C40Log0LrQvtGA0YDQtdC60YLQvdC+0LPQviDQvtGC0L7QsdGA0LDQttC10L3QuNGPIG9udGFwINC/0L7QtNGB0LLQtdGC0L7QuiDQvdCwINC80L7QsS3RhSDRg9GB0YLRgNC+0LnRgdGC0LLQsNGFXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHAgYXV0aC1sYXllclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZW1wdHktdG1wbC1hcHBcIj5cbiAgICAgICAgICAgICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwibWFpblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbnRhaW5lciBmbHVpZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3dpdGNoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9yZWdpc3RyYXRpb25cIiBuYW1lPVwicmVnaXN0clwiIGNvbXBvbmVudD17UmVnaXN0cmF0aW9ufS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL2F1dGhvcml6YXRpb25cIiBuYW1lPVwiYXV0aG9yaXpcIiBjb21wb25lbnQ9e0F1dGhvcml6YXRpb259Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1N3aXRjaD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsdXJfbGF5b3V0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9tYWluPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFbXB0eTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29udGFpbmVycy9FbXB0eS9FbXB0eS5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBTEE7QUFEQTtBQURBO0FBREE7QUFjQTs7Ozs7O0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/containers/Empty/Empty.js\n")}});