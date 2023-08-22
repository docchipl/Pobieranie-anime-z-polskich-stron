"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceJuniorSubs = exports.ServiceDesuOnline = exports.ServicePaldea = exports.ServiceMakiSubs = exports.ServiceMioroSubs = void 0;
var MioroSubs_1 = require("./MioroSubs");
Object.defineProperty(exports, "ServiceMioroSubs", { enumerable: true, get: function () { return __importDefault(MioroSubs_1).default; } });
var MakiSubs_1 = require("./MakiSubs");
Object.defineProperty(exports, "ServiceMakiSubs", { enumerable: true, get: function () { return __importDefault(MakiSubs_1).default; } });
var Paldea_1 = require("./Paldea");
Object.defineProperty(exports, "ServicePaldea", { enumerable: true, get: function () { return __importDefault(Paldea_1).default; } });
var DesuOnline_1 = require("./DesuOnline");
Object.defineProperty(exports, "ServiceDesuOnline", { enumerable: true, get: function () { return __importDefault(DesuOnline_1).default; } });
var JuniorSubs_1 = require("./JuniorSubs");
Object.defineProperty(exports, "ServiceJuniorSubs", { enumerable: true, get: function () { return __importDefault(JuniorSubs_1).default; } });
