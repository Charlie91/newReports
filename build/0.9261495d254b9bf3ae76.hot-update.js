webpackHotUpdate(0,{"./src/views/Registration/inputs/EmailInput.js":function(module,exports,__webpack_require__){"use strict";eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(\"./node_modules/react/react.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Authorization = __webpack_require__(\"./src/views/Authorization/Authorization.js\");\n\nvar _api_paths = __webpack_require__(\"./src/utils/api_paths.js\");\n\nvar _utils = __webpack_require__(\"./src/utils/utils.js\");\n\nvar _ClearField = __webpack_require__(\"./src/views/Registration/inputs/ClearField.js\");\n\nvar _ClearField2 = _interopRequireDefault(_ClearField);\n\nvar _ParentInput2 = __webpack_require__(\"./src/views/Registration/inputs/ParentInput.js\");\n\nvar _ParentInput3 = _interopRequireDefault(_ParentInput2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar EmailInput = function (_ParentInput) {\n    _inherits(EmailInput, _ParentInput);\n\n    //Внимание! Наследует от родительского компонента\n    function EmailInput(props) {\n        _classCallCheck(this, EmailInput);\n\n        var _this = _possibleConstructorReturn(this, (EmailInput.__proto__ || Object.getPrototypeOf(EmailInput)).call(this, props));\n\n        _this.state = {\n            value: props.value ? props.value : '',\n            focus: null,\n            isValid: props.isValid\n        };\n        return _this;\n    }\n\n    _createClass(EmailInput, [{\n        key: 'showHint',\n        value: function showHint() {\n            //функция рендера сообщения подсказки\n            if (this.state.focus && !(this.state.isValid === false && this.state.isNotAvailable === false)) {\n                return _react2.default.createElement(\n                    'div',\n                    { className: 'hintMessage' },\n                    'a-z0-9 \\u043D\\u0435 \\u0431\\u043E\\u043B\\u0435\\u0435 16 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u043E\\u0432'\n                );\n            }\n        }\n    }, {\n        key: 'showError',\n        value: function showError() {\n            //функция рендера сообщения об ошибке\n            if (this.state.isValid === false) {\n                return _react2.default.createElement(\n                    'div',\n                    { className: 'errorMessage' },\n                    '\\u0410\\u0434\\u0440\\u0435\\u0441 E-mail \\u043C\\u043E\\u0436\\u0435\\u0442 \\u0431\\u044B\\u0442\\u044C \\u043D\\u0435 \\u043C\\u0435\\u043D\\u0435\\u0435 3 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u043E\\u0432,\\u0441\\u043E\\u0441\\u0442\\u043E\\u044F\\u0442\\u044C \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0438\\u0437 \\u043B\\u0430\\u0442\\u0438\\u043D\\u0441\\u043A\\u0438\\u0445 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u043E\\u0432,@ \\u0438\\u043B\\u0438 \\u043A\\u0438\\u0440\\u0438\\u043B\\u043B\\u0438\\u0446\\u044B'\n                );\n            } else if (this.state.isNotAvailable) {\n                return _react2.default.createElement(\n                    'div',\n                    { className: 'errorMessage' },\n                    'E-mail ',\n                    this.state.isNotAvailable,\n                    ' \\u0437\\u0430\\u043D\\u044F\\u0442'\n                );\n            }\n        }\n    }, {\n        key: 'checkAvailability',\n        value: function checkAvailability() {\n            var _this2 = this;\n\n            var url = _api_paths.API.register + '?email=' + this.state.value;\n            var options = {\n                method: 'GET',\n                mode: 'cors'\n            };\n            (0, _utils.ajaxRequest)(url, options).then(function (data) {\n                if (data.present) _this2.setState({ isNotAvailable: _this2.state.value });else _this2.setState({ isNotAvailable: false });\n            }).catch(function (error) {\n                return console.log(error);\n            });\n        }\n    }, {\n        key: 'validateField',\n        value: function validateField(e) {\n            //функция-валидация\n            var value = this.state.value; //e.target.value;\n            this.hideHint(); //прячем окно с подсказкой\n            var regExp = new RegExp('^[a-zA-Zа-яА-Я0-9-_\\.@]{3,30}$');\n            if (!regExp.test(value)) {\n                //проверка на соответствие регэкспу\n                this.setState({ isValid: false });\n                this.props.fieldIsValid('email', false);\n            } else {\n                this.setState({ isValid: true });\n                this.props.fieldIsValid('email', value);\n            }\n            this.checkAvailability();\n        }\n        //\n\n    }, {\n        key: 'render',\n        value: function render() {\n            return _react2.default.createElement(\n                'div',\n                { className: 'form-group' },\n                _react2.default.createElement(\n                    'label',\n                    null,\n                    (0, _Authorization.animateDynamicLabel)(this.state.value, 'E-mail'),\n                    _react2.default.createElement('input', { onFocus: this.setHint.bind(this),\n                        onBlur: this.validateField.bind(this),\n                        onChange: this.setValue.bind(this),\n                        value: this.state.value,\n                        className: \"form-control \" + (this.state.isValid === false ? 'hasErrors' : ''),\n                        type: 'text',\n                        placeholder: '\\u0410\\u0434\\u0440\\u0435\\u0441 E-mail'\n                    }),\n                    _react2.default.createElement(_ClearField2.default, { render: this.state.value, clearField: this.clearField.bind(this) }),\n                    this.showHint(),\n                    this.showError()\n                )\n            );\n        }\n    }]);\n\n    return EmailInput;\n}(_ParentInput3.default);\n\nexports.default = EmailInput;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdmlld3MvUmVnaXN0cmF0aW9uL2lucHV0cy9FbWFpbElucHV0LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy92aWV3cy9SZWdpc3RyYXRpb24vaW5wdXRzL0VtYWlsSW5wdXQuanM/NDM4YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHthbmltYXRlRHluYW1pY0xhYmVsfSBmcm9tICcuLi8uLi9BdXRob3JpemF0aW9uL0F1dGhvcml6YXRpb24nO1xuaW1wb3J0IHtBUEl9IGZyb20gJy4vLi4vLi4vLi4vdXRpbHMvYXBpX3BhdGhzJztcbmltcG9ydCB7YWpheFJlcXVlc3QsY2hlY2tFaXRoZXJMb2dnZWRJbk9yTm90fSBmcm9tICcuLy4uLy4uLy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCBDbGVhckZpZWxkIGZyb20gJy4vQ2xlYXJGaWVsZCc7XG5pbXBvcnQgUGFyZW50SW5wdXQgZnJvbSAnLi9QYXJlbnRJbnB1dCc7XG5cbmNsYXNzIEVtYWlsSW5wdXQgZXh0ZW5kcyBQYXJlbnRJbnB1dCB7IC8v0JLQvdC40LzQsNC90LjQtSEg0J3QsNGB0LvQtdC00YPQtdGCINC+0YIg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0LrQvtC80L/QvtC90LXQvdGC0LBcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHZhbHVlOihwcm9wcy52YWx1ZSkgPyBwcm9wcy52YWx1ZSA6ICcnLFxuICAgICAgICAgICAgZm9jdXM6bnVsbCxcbiAgICAgICAgICAgIGlzVmFsaWQ6cHJvcHMuaXNWYWxpZFxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBzaG93SGludCgpeyAgLy/RhNGD0L3QutGG0LjRjyDRgNC10L3QtNC10YDQsCDRgdC+0L7QsdGJ0LXQvdC40Y8g0L/QvtC00YHQutCw0LfQutC4XG4gICAgICAgIGlmKHRoaXMuc3RhdGUuZm9jdXMgJiYgISh0aGlzLnN0YXRlLmlzVmFsaWQgPT09IGZhbHNlICYmIHRoaXMuc3RhdGUuaXNOb3RBdmFpbGFibGUgPT09IGZhbHNlKSl7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoaW50TWVzc2FnZVwiPmEtejAtOSDQvdC1INCx0L7Qu9C10LUgMTYg0YHQuNC80LLQvtC70L7QsjwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0Vycm9yKCl7ICAgICAgICAgICAgLy/RhNGD0L3QutGG0LjRjyDRgNC10L3QtNC10YDQsCDRgdC+0L7QsdGJ0LXQvdC40Y8g0L7QsSDQvtGI0LjQsdC60LVcbiAgICAgICAgaWYodGhpcy5zdGF0ZS5pc1ZhbGlkID09PSBmYWxzZSl7XG4gICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1lc3NhZ2VcIj7QkNC00YDQtdGBIEUtbWFpbCDQvNC+0LbQtdGCINCx0YvRgtGMINC90LUg0LzQtdC90LXQtSAzINGB0LjQvNCy0L7Qu9C+0LIs0YHQvtGB0YLQvtGP0YLRjCDRgtC+0LvRjNC60L4g0LjQtyDQu9Cw0YLQuNC90YHQutC40YUg0YHQuNC80LLQvtC70L7QsixAINC40LvQuCDQutC40YDQuNC70LvQuNGG0Ys8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuc3RhdGUuaXNOb3RBdmFpbGFibGUpe1xuICAgICAgICAgICAgcmV0dXJuKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNZXNzYWdlXCI+RS1tYWlsIHt0aGlzLnN0YXRlLmlzTm90QXZhaWxhYmxlfSDQt9Cw0L3Rj9GCPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0F2YWlsYWJpbGl0eSgpe1xuICAgICAgICBsZXQgdXJsID0gQVBJLnJlZ2lzdGVyICsgJz9lbWFpbD0nICsgdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6J0dFVCcsXG4gICAgICAgICAgICBtb2RlOiAnY29ycydcbiAgICAgICAgfTtcbiAgICAgICAgYWpheFJlcXVlc3QodXJsLG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLnByZXNlbnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTm90QXZhaWxhYmxlOnRoaXMuc3RhdGUudmFsdWV9KVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNOb3RBdmFpbGFibGU6ZmFsc2V9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlRmllbGQoZSl7Ly/RhNGD0L3QutGG0LjRjy3QstCw0LvQuNC00LDRhtC40Y9cbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTsvL2UudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLmhpZGVIaW50KCk7IC8v0L/RgNGP0YfQtdC8INC+0LrQvdC+INGBINC/0L7QtNGB0LrQsNC30LrQvtC5XG4gICAgICAgIGxldCByZWdFeHAgPSBuZXcgUmVnRXhwKCdeW2EtekEtWtCwLdGP0JAt0K8wLTktX1xcLkBdezMsMzB9JCcpO1xuICAgICAgICBpZighcmVnRXhwLnRlc3QodmFsdWUpKXsgICAvL9C/0YDQvtCy0LXRgNC60LAg0L3QsCDRgdC+0L7RgtCy0LXRgtGB0YLQstC40LUg0YDQtdCz0Y3QutGB0L/Rg1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNWYWxpZDpmYWxzZX0pO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5maWVsZElzVmFsaWQoJ2VtYWlsJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzVmFsaWQ6dHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5maWVsZElzVmFsaWQoJ2VtYWlsJyx2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0F2YWlsYWJpbGl0eSgpO1xuICAgIH1cbi8vXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIHthbmltYXRlRHluYW1pY0xhYmVsKHRoaXMuc3RhdGUudmFsdWUsICdFLW1haWwnKX1cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG9uRm9jdXM9e3RoaXMuc2V0SGludC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLnZhbGlkYXRlRmllbGQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnNldFZhbHVlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XCJmb3JtLWNvbnRyb2wgXCIgKyAoICh0aGlzLnN0YXRlLmlzVmFsaWQgPT09IGZhbHNlKSA/ICdoYXNFcnJvcnMnIDogJycpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0JDQtNGA0LXRgSBFLW1haWxcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8Q2xlYXJGaWVsZCByZW5kZXI9e3RoaXMuc3RhdGUudmFsdWV9IGNsZWFyRmllbGQ9e3RoaXMuY2xlYXJGaWVsZC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnNob3dIaW50KCl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnNob3dFcnJvcigpfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRW1haWxJbnB1dDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3ZpZXdzL1JlZ2lzdHJhdGlvbi9pbnB1dHMvRW1haWxJbnB1dC5qcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7Ozs7Ozs7OztBQUNBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFPQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7O0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUlBO0FBQ0E7QUFBQTtBQUNBOzs7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQVpBO0FBREE7QUFpQkE7Ozs7OztBQUdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/views/Registration/inputs/EmailInput.js\n")}});