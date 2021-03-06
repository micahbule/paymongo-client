"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent_1 = __importDefault(require("superagent"));
var crypto_1 = require("crypto");
var modes_1 = require("./modes");
var Paymongo = /** @class */ (function () {
    function Paymongo(publicKey, secretKey) {
        var _this = this;
        this.baseUrl = 'https://api.paymongo.com/v1';
        this.constructPayload = function (attributes) { return ({
            data: { attributes: attributes },
        }); };
        this.sendRequest = function (url, method) {
            if (method === void 0) { method = 'GET'; }
            return superagent_1.default(method, "" + _this.baseUrl + url);
        };
        this.createPaymentIntent = function (attributes) { return __awaiter(_this, void 0, void 0, function () {
            var amount, rest, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount = attributes.amount, rest = __rest(attributes, ["amount"]);
                        payload = this.constructPayload(__assign(__assign({}, rest), { 
                            /**
                             * This assumes amount is either whole integer or a
                             * 2-decimal floating point number
                             *
                             * Truncate trailing zeroes to get whole integer equivalent
                             * of the amount
                             *
                             * Check JS weirdness here
                             * https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
                             */
                            amount: Math.trunc(amount * 100), 
                            /** Override values for now until API updates */
                            payment_method_allowed: ['card'], currency: 'PHP' }));
                        return [4 /*yield*/, this.sendRequest('/payment_intents', 'POST').set(this.getHeaders()).send(payload)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.createSource = function (attributes) { return __awaiter(_this, void 0, void 0, function () {
            var amount, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount = attributes.amount;
                        payload = this.constructPayload(__assign(__assign({}, attributes), { 
                            /**
                             * This assumes amount is either whole integer or a
                             * 2-decimal floating point number
                             *
                             * Truncate trailing zeroes to get whole integer equivalent
                             * of the amount
                             *
                             * Check JS weirdness here
                             * https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
                             */
                            amount: Math.trunc(amount * 100), currency: 'PHP' }));
                        return [4 /*yield*/, this.sendRequest('/sources', 'POST').set(this.getHeaders()).send(payload)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.createPayment = function (attributes) { return __awaiter(_this, void 0, void 0, function () {
            var payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = this.constructPayload(__assign(__assign({}, attributes), { currency: 'PHP' }));
                        return [4 /*yield*/, this.sendRequest('/payments', 'POST').set(this.getHeaders()).send(payload)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.attachPaymentIntent = function (_a) {
            var intentId = _a.intentId, methodId = _a.methodId, redirect = _a.redirect, clientKey = _a.clientKey;
            return __awaiter(_this, void 0, void 0, function () {
                var payloadData, payload, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            payloadData = {
                                payment_method: methodId,
                            };
                            if (typeof redirect !== 'undefined') {
                                payloadData.return_url = redirect;
                            }
                            if (typeof clientKey !== 'undefined') {
                                payloadData.client_key = clientKey;
                            }
                            payload = this.constructPayload(payloadData);
                            return [4 /*yield*/, this.sendRequest("/payment_intents/" + intentId + "/attach", 'POST').set(this.getHeaders()).send(payload)];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        this.retrievePaymentIntent = function (intentId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendRequest("/payment_intents/" + intentId).set(this.getHeaders()).send()];
            });
        }); };
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }
    Paymongo.prototype.getHeaders = function (useSecret) {
        if (useSecret === void 0) { useSecret = true; }
        var authKey = useSecret ? this.secretKey : this.publicKey;
        var authString = Buffer.from(authKey + ":").toString('base64');
        var headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic " + authString,
        };
        return headers;
    };
    Paymongo.verifyWebhook = function (webhookSecretKey, header, payload, mode) {
        var _a = header.split(','), timestamp = _a[0], testSig = _a[1], liveSig = _a[2];
        if (!timestamp || !testSig || !liveSig)
            return false;
        var signatureComposition = timestamp.slice(2) + "." + payload;
        var hmac = crypto_1.createHmac('sha256', webhookSecretKey);
        hmac.update(signatureComposition, 'utf8');
        var signature = hmac.digest('hex');
        var sigToCompare = mode === modes_1.Modes.Test ? testSig.slice(3) : liveSig.slice(3);
        return signature === sigToCompare;
    };
    return Paymongo;
}());
exports.default = Paymongo;
