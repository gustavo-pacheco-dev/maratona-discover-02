let data = [
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
]


module.exports = {
    get() {
        return data;
    },
    create(newJob) {
        data.push(newJob);
    },
    update(newJobs) {
        data = newJobs;
    },
    delete(id) {
        data = data.filter(job => Number(job.id) !== Number(id));
    }
}