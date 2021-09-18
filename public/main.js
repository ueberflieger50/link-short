const app = {
  data() {
    return {
      formData: {},
      shortUrl: null,
      urls: null,
    };
  },
  computed: {
    linkUrl() {
      if(this.shortUrl) return window.location.href + this.shortUrl;
    },
  },
  methods: {
    createNewLink: function () {
      // console.log(JSON.stringify(this.formData));
      fetch('/api/new', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
      }).then(res => res.text()).then((res) =>{
        this.shortUrl = res;
        delete this.formData.newUrl;
        delete this.formData.customId;
      });
    },
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
