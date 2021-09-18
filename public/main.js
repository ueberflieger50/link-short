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
      fetch('/api/all').then(res => res.json()).then(res => {
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
        fetch(`/api/remove/${id}`, { method: 'DELETE'}).then(res => res.json()).then((res) => {
          this.urls = res;
        });
      }
    },
  },
};
Vue.createApp(app).mount("main");
