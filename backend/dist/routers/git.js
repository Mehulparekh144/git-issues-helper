"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const git_1 = require("../services/git");
const router = (0, express_1.Router)();
router.post("/new", async (req, res) => {
    const { repo } = req.body;
    const data = await (0, git_1.getGitRepoContents)(repo);
    res.json(data);
});
exports.default = router;
//# sourceMappingURL=git.js.map