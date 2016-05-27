jobsC = JobCollection('job');
jobsC.startJobServer();

Job.processJobs(jobsC, 'test', function (job, cb) {
  console.log('job', job.data);
  cb();
});
