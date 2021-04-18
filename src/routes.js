const express = require('express')
const routes = express.Router()

// using template engine
const views = __dirname + '/views/'

const Profile = {
    data: {
        name: "Gustavo",
        avatar: "https://github.com/gustavinho-dev.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },
    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data }) 
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
            data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = data


            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        }
    ],
    controllers: {
        index(req, res) {

                const updatedJobs = Job.data.map((job) => {
                    const remaining = Job.services.remainingDays(job)
                    const status = remaining <= 0 ? 'done' : 'progress'
            
            
                    return {
                        ...job,
                        remaining,
                        status,
                        budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                    }
                })
            
            
                return res.render(views + "index", { 
                    profileName: Profile.data.name, 
                    profileAvatar: Profile.data.avatar, 
                    jobs: updatedJobs
            })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })
            

            return res.redirect('/')
        },
        show(req, res) {
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId) )
            

            if (!job) {
                return res.send('Job not found!!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data['value-hour'])


            return res.render(views + "job-edit", { job })
        },
        update(req, res) {
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId) )
            

            if (!job) {
                return res.send('Job not found!!')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }
            
            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob 
                }


                return job
            })


            res.redirect('/job/' + jobId)
        },
        delete(req, res) {
            const jobId = req.params.id
            
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))


            return res.redirect('/')
        }
    },
    services: {
        remainingDays(job) {
            const initialRemainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(initialRemainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
        
            const timeDiffInMs = dueDateInMs - Date.now()
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
        
            return dayDiff
        },
        calculateBudget(job, valueHour) {
            const budget = Number(valueHour) * job['total-hours']


            return budget
        }
        
    }
}


// req, res
routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)

routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)


module.exports = routes;