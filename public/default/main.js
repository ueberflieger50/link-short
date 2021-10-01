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
    openModal: function () {
      document.querySelector(".modal").classList.add("active");
    },
    closeModal: function () {
      document.querySelector(".modal").classList.remove("active");
    },
    authorize: function (type) {
      if (type == "login") {
        // Try to authenticate user
        fetch("/auth/login", {
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
              // Reload Paget to provied page for loged in users
              location.reload();
            } else {
              alert(
                "There was some problem while trying to authenticate you. An errormessage was loged to the console"
              );
            }
          })
          .catch((err) => {
            alert(
              "There was some problem while trying to authenticate you. An errormessage was loged to the console"
            );
            console.log(err);
          });
        // Delete temporaryly stored password and username
        delete this.user.username;
        delete this.user.password;
      } else if (type == "register") {
        // Register User
        fetch("/auth/register", {
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
          })
          .catch((err) => {
            alert(
              "There was some problem while trying to create your user. An errormessage was loged to the console"
            );
            console.log(err);
          });
        // Delete temporaryly stored password and username
        delete this.user.username;
        delete this.user.password;
      }
    },
  },
};
Vue.createApp(app).mount("body");

function authenticateUser(username, password) {}

function registerUser(username, password) {}
