const Profile = require('../model/Profile')


module.exports = {
    index(req, res) {
        return res.render("profile", { profile: Profile.get() }) 
    },
    update(req, res) {
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


        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })


        return res.redirect('/profile')
    }
}
