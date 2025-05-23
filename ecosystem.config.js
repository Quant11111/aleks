module.exports = {
  apps: [
    {
      name: "aleks",
      script: "python3",
      args: "-m http.server 3002",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        PORT: 3002,
      },
      log_file: "./logs/app.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      time: true,
    },
  ],
};
