const Profile = require('../model/Profile')


module.exports = {
    async index(req, res) {
        return res.render("profile", { profile: await Profile.get() }) 
    },
    async update(req, res) {
        // req.body to get the data
        const data = req.body
        
        // define how many weeks you have in a year
        const weeksPerYear = 52
        
        // remove the holiday weeks of the year to get how many weeks you have in a month
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

        // total hours worked in the week
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

        // total hours worked in the month
        const monthlyTotalHours = weekTotalHours * weeksPerMonth

        // What's the hourly value
        const valueHour = data["monthly-budget"] / monthlyTotalHours

        const profile = await Profile.get();


        await Profile.update({
            ...profile,
            ...req.body,
            "value-hour": valueHour
        })


        return res.redirect('/profile')
    }
}
