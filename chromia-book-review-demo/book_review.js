"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var postchain_client_1 = require("postchain-client");
var readline = require("readline");
var privKey = Buffer.from("2BB56EA28F38FA9373693C00B7BC3C33AC74E89CAE7F662C8B125CEA765DA94E", "hex");
var bookKeeperKeyPair = postchain_client_1.encryption.makeKeyPair(privKey);
var bookKeeperSignatureProvider = (0, postchain_client_1.newSignatureProvider)(bookKeeperKeyPair);
var client;
var blockchainRID = "CE292B232DB9DB6FF397C6A83905C5D198E42EC9D5028AB8317F17CBD571A810";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, postchain_client_1.createClient)({
                        nodeUrlPool: "http://localhost:7740",
                        blockchainRid: blockchainRID,
                    })];
                case 1:
                    client = _a.sent();
                    console.log("Creting a new book transactions");
                    return [4 /*yield*/, client.signAndSendUniqueTransaction({ name: "create_book", args: ["ISBN1", "Chromia 101", "John Doe"] }, bookKeeperSignatureProvider)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getInput("Transaction comitted!\npress any key to continue...")];
                case 3:
                    _a.sent();
                    console.log("Let's fetch and view all books currently in the node");
                    return [4 /*yield*/, getAllBooks()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, getInput("Press any key to continue...")];
                case 5:
                    _a.sent();
                    console.log("We can now add a second book");
                    return [4 /*yield*/, client.signAndSendUniqueTransaction({ name: "create_book", args: ["ISBN2", "Rell 101", "Jane Doe"] }, bookKeeperSignatureProvider)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, getInput("Transaction comitted, press any key to continue...")];
                case 7:
                    _a.sent();
                    console.log("Let's fetch and view all books currently in the node");
                    return [4 /*yield*/, getAllBooks()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, getInput("Press any key to continue...")];
                case 9:
                    _a.sent();
                    console.log("We can now add two reviews for the book with ISBN = ISBN2");
                    return [4 /*yield*/, client.signAndSendUniqueTransaction({
                            name: "create_book_review",
                            args: ["ISBN2", "Bob Doe", "This is a great book!", 5],
                        }, bookKeeperSignatureProvider)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, client.signAndSendUniqueTransaction({
                            name: "create_book_review",
                            args: ["ISBN2", "Charlie Doe", "It was ok!", 3],
                        }, bookKeeperSignatureProvider)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, getInput("Transaction comitted, press any key to continue...")];
                case 12:
                    _a.sent();
                    console.log("Let's fetch and view all books currently in the node");
                    return [4 /*yield*/, getReviewsForBook("ISBN2")];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, getInput("Press any key to continue...")];
                case 14:
                    _a.sent();
                    console.log("Now lets look at all transaction that have been commited to the blockchain");
                    return [4 /*yield*/, getAllTransactions()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, getInput("Press any key to continue...")];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addBook() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creting a new book transactions");
                    return [4 /*yield*/, client.signAndSendUniqueTransaction({ name: "create_book", args: ["ISBN4", "Chromia 101", "John Doe"] }, bookKeeperSignatureProvider)];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
var getAllBooks = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bookList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.query("get_all_books", {})];
            case 1:
                bookList = _a.sent();
                console.log("Book list\n", bookList);
                return [2 /*return*/];
        }
    });
}); };
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function getInput(query) {
    return new Promise(function (resolve) {
        rl.question(query, function (answer) {
            resolve(answer);
        });
    });
}
var getReviewsForBook = function (isbn) { return __awaiter(void 0, void 0, void 0, function () {
    var bookList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.query("get_all_reviews_for_book", { isbn: isbn })];
            case 1:
                bookList = _a.sent();
                console.log("Book review list\n", bookList);
                return [2 /*return*/];
        }
    });
}); };
var getAllTransactions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.query("get_transactions", {}).then(function (transactions) {
                    transactions.forEach(function (tx) {
                        console.log("TxRID:", tx.tx_body.tx_rid.toString("hex"));
                        tx.tx_body.ops.forEach(function (op) {
                            console.log("OpName:", op.op_name);
                            console.log("OpArgs:", op.op_args);
                        });
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.query("get_transactions", {})];
            case 2:
                transactions = (_a.sent());
                transactions.forEach(function (tx) {
                    console.log("TxRID:", tx.tx_body.tx_rid.toString("hex"));
                    tx.tx_body.ops.forEach(function (op) {
                        console.log("OpName:", op.op_name);
                        console.log("OpArgs:", op.op_args);
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
main();
