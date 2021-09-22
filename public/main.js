const app = {
  data() {
    return {
      formData: {},
      shortUrl: null,
      urls: null,
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
      // console.log(JSON.stringify(this.formData));
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
          this.urls = res;
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
    openModal: function () {
      document.querySelector(".modal").classList.add("active");
    },
    closeModal: function () {
      document.querySelector(".modal").classList.remove("active");
    },
    authorize: function (type) {
      if (type == "login") {
        fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.user.username,
            password: this.user.password,
          }),
        })
          .then((res) => {
            this.closeModal();
            if (res.status === 202) {
              this.user.isLoggedIn = true;
            }
            delete this.user.password;
          })
          .catch((err) => {
            console.log(err);
            delete this.user.username;
            delete this.user.password;
          });
      } else if (type == "register") {
        fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.user.username,
            password: this.user.password,
          }),
        })
          .then((res) => res.text())
          .then((res) => {
            this.closeModal();
            delete this.user.username;
            delete this.user.password;
          })
          .catch((err) => {
            console.log(err);
            delete this.user.username;
            delete this.user.password;
          });
      }
    },
    logout: function () {
      fetch("/logout", {
        method: "DELETE",
      })
        .then((res) => {
          this.user.isLoggedIn = false;
        })
        .catch((err) => {
          console.log(err);
        });
      delete this.user.username;
    },
    getLoggedIn: function () {
      fetch("/isloggedin")
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
  },
};
Vue.createApp(app).mount("body");
