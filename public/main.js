const Http = new XMLHttpRequest();

let url = new URL(window.location.href);

const app = {
  data() {
    return {
      linkId: url.searchParams.get("link"),
      currUrl: window.location.href.split("?")[0],
      urls: null,
    };
  },
  computed: {
    linkUrl() {
      return this.currUrl + this.linkId;
    },
  },
  methods: {
    getAll: function () {
      Http.open("GET", "/api/all");
      Http.send();

      Http.onload = (e) => {
        this.urls = JSON.parse(Http.responseText);
      };
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
    deleteEntry: function (number, link) {
      if (confirm("🗑 Are you sure you want to delete the link to: " + link)) {
        Http.open("DELETE", `/api/remove/${number}`);
        Http.send();

        Http.onload = (e) => {
          this.urls = JSON.parse(Http.responseText);
        };
      }
    },
  },
};
Vue.createApp(app).mount("main");
