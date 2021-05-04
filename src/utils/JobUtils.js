module.exports = {
    remainingDays(job) {
        const initialRemainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
    
        const createdDate = new Date(job.created_at)
        const dueDay = createdDate.getDate() + Number(initialRemainingDays)
        const dueDateInMs = createdDate.setDate(dueDay)
    
        const timeDiffInMs = dueDateInMs - Date.now()
        const dayInMs = 1000 * 60 * 60 * 24
        const dayDiff = Math.ceil(timeDiffInMs / dayInMs)
    
    
        return dayDiff;
    },
    calculateBudget(job, valueHour) {
        const budget = Number(valueHour) * job['total-hours']


        return budget;
    }
}
