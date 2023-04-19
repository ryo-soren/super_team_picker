const express = require("express")
const knex = require("../db/client")
const router = express.Router()


router.get("/new", (req,res) => {
    res.render("super_team/new", {cohort: false})
})

router.get("/", (req,res) => {
    res.render("super_team/home")
})

router.get("/index", (req,res) => {
    knex("super_teams")
    .orderBy('id', "desc")
    .then(cohorts => {
    res.render("super_team/index", {cohorts: cohorts})
    })
})

router.get("/:id", (req,res) => {
    knex("super_teams")
    .where("id", req.params.id)
    .first()
    .then(cohort => {
        if (!cohort) {
            res.render("super_team/view", {cohort: cohort, memberSplit: false})
        } else {
            res.render("super_team/view", {cohort: cohort, memberSplit: false})
        }
    })
})

router.get("/:id/edit", (req,res) => {
    knex("super_teams")
    .where("id", req.params.id)
    .first()
    .then(cohort => {
        if (!cohort) {
            res.send("super_team/edit", {cohort: false})
        } else {
            res.render("super_team/edit", {cohort: cohort})
        }
    })
})

router.get("/:id/split_teams", (req,res) => {
    knex("super_teams")
    .where("id", req.params.id)
    .first()
    .then(cohort => {

        const method = req.query.teamMethod
        let quantity = parseFloat(req.query.quantity)
        const members = cohort.members.split(", ")
        let memberSplit = []

        if (!cohort) {
            res.send("super_team/view", {cohort: false})
        } else {
            if (method === "number_per_team") {
                for (let i = 0; i < members.length; i += quantity) {
                    const sliced = members.slice(i, i+ quantity)
                    memberSplit.push(sliced)
                }
                if (memberSplit[memberSplit.length-1].length === 1) { //checks to see if last element is alone

                    memberSplit[memberSplit.length-2].push(memberSplit[memberSplit.length-1].join(""))
                    memberSplit.pop() // removes the last element after appending the single element to second last array

                    console.log(memberSplit);
                    res.render("super_team/view", {cohort: cohort, memberSplit : memberSplit})
                } else {
                    console.log(memberSplit);
                    res.render("super_team/view", {cohort: cohort, memberSplit : memberSplit})
                }

            } else {
                for (let i = 0; i < members.length; i += (Math.round(members.length/quantity))) {
                    const sliced = members.slice(i, i+(Math.round(members.length/quantity)))
                    memberSplit.push(sliced)
                }
                if (memberSplit[memberSplit.length-1].length === 1) {

                    memberSplit[memberSplit.length-2].push(memberSplit[memberSplit.length-1].join(""))
                    memberSplit.pop()

                    console.log(memberSplit);
                    res.render("super_team/view", {cohort: cohort, memberSplit : memberSplit})
                } else {
                    console.log(memberSplit);
                    res.render("super_team/view", {cohort: cohort, memberSplit : memberSplit})
                }
        }

        }
    })
})

router.post("/", (req,res) =>{
    knex("super_teams")
    .insert({
        team_name: req.body.team_name,
        members: req.body.members,
        image_url: req.body.image_url
    })
    .returning("*")
    .then(cohorts => {
        const cohort = cohorts[0]
        res.redirect(`super_team_picker/${cohort.id}`)
    })
})

router.patch("/:id", (req,res) => {
    knex("super_teams")
    .where("id", req.params.id)
    .update({
        team_name: req.body.team_name,
        members: req.body.members,
        image_url: req.body.image_url
    })
    .then(() => {
        res.redirect(`/super_team_picker/${req.params.id}`)
    })
})

router.delete("/:id", (req,res) => {
    knex("super_teams")
    .where("id", req.params.id)
    .delete()
    .then(() => {
        res.redirect("/super_team_picker/index")
    })
})

module.exports = router
