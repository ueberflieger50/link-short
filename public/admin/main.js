const app = {
  data() {
    return {
      formData: {},
      shortUrl: null,
      all: null,
      my: null,
      users: null,
      user: {
        isLoggedIn: null,
      },
    };
  },
  computed: {
    linkUrl() {
      if (this.shortUrl) return window.location.href + this.shortUrl;
    },
  },
  mounted() {
    this.getLoggedIn();
  },
  methods: {
    createNewLink: function () {
      fetch("/api/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      })
        .then((res) => res.text())
        .then((res) => {
          this.shortUrl = res;
          delete this.formData.newUrl;
          delete this.formData.customId;
        });
    },
    getAll: function () {
      fetch("/api/all")
        .then((res) => res.json())
        .then((res) => {
          this.all = res;
        });
    },
    getMy: function () {
      fetch("/api/my")
        .then((res) => res.json())
        .then((res) => {
          this.my = res;
        });
    },
    copyToClipboard: function (text) {
      if (!navigator.clipboard) {
        alert("Sorry, but your Browser dosent support Clipboard API");
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {},
        (err) => {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
    deleteEntry: function (id, link) {
      if (confirm("🗑 Are you sure you want to delete the link to: " + link)) {
        fetch(`/api/remove/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then((res) => {
            this.urls = res;
          });
      }
    },
    logout: function () {
      fetch("/auth/logout", {
        method: "DELETE",
      })
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          alert(
            "Error whyle trying to log out. The error was loged to the console"
          );
          console.log(err);
        });
      delete this.user.username;
    },
    getLoggedIn: function () {
      fetch("/auth/isloggedin")
        .then((res) => res.json())
        .then((res) => {
          if (res[0] === true) {
            this.user.isLoggedIn = res[0];
            this.user.username = res[1];
          } else {
            this.user.isLoggedIn = false;
          }
        });
    },
    getAllUsers: function () {
      fetch("/api/user/all")
        .then((res) => res.json())
        .then((res) => {
          this.users = res;
        });
    },
    removeUser: function (id, username) {
      if (confirm("🗑 Are you sure you want to delete the user: " + username)) {
        if (username === this.user.username) {
          fetch(`/api/user/remove/${id}`, { 
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ logout: true })
          }).then(() => {
            location.reload();
          });
        } else {
          fetch(`/api/user/remove/${id}`, { method: "DELETE" })
            .then((res) => res.json())
            .then((res) => {
              this.users = res;
            });
        }
      }
    },
    alterUser: function (id) {
      fetch(`/api/user/alter/${id}`, { method: "PATCH" })
        .then((res) => res.json())
        .then((res) => {
          res.forEach((elem) => {
            if (elem.username === this.user.username && elem.role === "user") {
              location.reload();
            }
          });
          this.users = res;
        });
    },
  },
};
Vue.createApp(app).mount("body");
