(function () {
  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Contact form: static site, nothing is sent anywhere
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var msg = document.getElementById("form-msg");
      var name = (form.elements.name.value || "").trim().split(" ")[0];
      var special = form.elements.service.value === "special";
      msg.textContent = special
        ? "Smart move" + (name ? ", " + name : "") + ". This form doesn't actually send anything, and for this kind of job, that's exactly how Brian likes it."
        : "Thanks" + (name ? ", " + name : "") + ". Bad news: this form doesn't actually send anything. Lori's been meaning to fix it since 1998.";
      msg.classList.add("is-on");
      form.reset();
    });
  }

  // Official screenshots: show a placeholder until the file exists
  Array.prototype.forEach.call(document.querySelectorAll("img[data-official]"), function (img) {
    var fig = img.closest(".official");
    function miss() { if (fig) fig.classList.add("is-missing"); }
    img.addEventListener("error", miss);
    img.addEventListener("load", function () { if (fig) fig.classList.remove("is-missing"); });
    if (img.complete && img.naturalWidth === 0) miss();
    img.loading = "eager";
  });

  // Fishing conditions (parody). Small daily variations, the important lines never change.
  var wx = document.getElementById("wx-date");
  if (wx) {
    var d = new Date();
    var flParts = (function () {
      try {
        var o = {}; new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" })
          .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
        return o;
      } catch (e) { return null; }
    })();
    // Florida calendar day: the same tip for every visitor worldwide, all day long
    var day = flParts ? Math.floor(Date.UTC(+flParts.year, +flParts.month - 1, +flParts.day) / 864e5) : Math.floor(d.getTime() / 864e5);
    var seed = day;
    var pick = function (arr, n) { return arr[(seed * (n + 7)) % arr.length]; };
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    wx.textContent = "Updated " + d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + ", around 6 AM Brian time";
    set("wx-wind", pick(["SE 8 kt", "E 10 kt", "ESE 6 kt", "Calm-ish", "SE 12 kt"], 1));
    set("wx-seas", pick(["1–2 ft", "Flat", "1 ft", "2 ft, then flat"], 2));
    set("wx-temp", pick(["78°F", "79°F", "80°F", "81°F"], 3));
    var TIPS = [
      "If anyone asks, you caught nothing.",
      "Coast Guard on your tail? A respray works on cars. Probably works on boats.",
      "Everyone waited 13 years for this. You can wait one hour for a launch.",
      "If a guy in a bucket hat starts talking about the moon landing, that's Cal. Nod and keep walking.",
      "Cheat codes don't work at the fuel dock. Jason tried them all.",
      "Low and slow over the flats. You know why.",
      "Our Dodo has full-size wings. We've all seen what happens with the short ones.",
      "The fish don't respawn. The Coast Guard does.",
      "Snowbirds always cut the line. It's not a bug. It's Leonida.",
      "You can't skip Brian's stories. They're unskippable cutscenes.",
      "Cooler on the boat, mouth shut on the dock.",
      "One star gets you a ticket. Five stars gets you Brian saying he's never met you.",
      "Long day on the water? Sleep in the safehouse. It saves your progress.",
      "Map markers are suggestions. Sandbars are not.",
      "No fast travel to the Keys. Take the Overseas Highway like everybody else.",
      "The fish don't talk. Neither should you.",
      "Our navigation policy: hold forward, don't hit anything.",
      "The boat radio has one station. Brian picked it. Don't touch it.",
      "No jetpacks in the launch zone. Not since the incident.",
      "Bring a big cooler. A really big cooler.",
      "If someone tells you to follow the train, you're at the wrong marina.",
      "Jason works on his tan during the loading screens."
    ];
    // Walk the list in order, one per day, so nothing repeats until every tip has been shown
    set("wx-tip", "Tip of the day: " + TIPS[((day % TIPS.length) + TIPS.length) % TIPS.length]);
    var days = ["wx-d1", "wx-d2", "wx-d3", "wx-d4"];
    for (var i = 0; i < days.length; i++) {
      var nd = new Date(d.getTime() + (i + 1) * 864e5);
      set(days[i], i === 0 ? "Tomorrow" : nd.toLocaleDateString("en-US", { weekday: "short" }));
    }
  }

  // Ramp / gate status, live by Florida time (Key Lento runs on Eastern Time)
  (function () {
    var flag = document.getElementById("ramp-flag");
    var gate = document.getElementById("gate-status");
    if (!flag && !gate) return;
    var OPEN = 7 * 60, CLOSE = 18 * 60; // 7:00 to 18:00, every day
    function floridaNow() {
      try {
        var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
        var h = 0, m = 0;
        parts.forEach(function (p) { if (p.type === "hour") h = parseInt(p.value, 10) % 24; if (p.type === "minute") m = parseInt(p.value, 10); });
        return h * 60 + m;
      } catch (e) { return null; }
    }
    function fmt(min) {
      var h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? "PM" : "AM";
      return ((h + 11) % 12 + 1) + ":" + (m < 10 ? "0" : "") + m + " " + ap;
    }
    function update() {
      var now = floridaNow();
      if (now === null) return;
      var open = now >= OPEN && now < CLOSE;
      var tip = "It's " + fmt(now) + " in Key Lento";
      if (flag) {
        flag.textContent = open ? "Ramp open" : "Ramp closed";
        flag.classList.toggle("is-closed", !open);
        flag.title = tip + (open ? ". Gate closes at 6:00 PM." : ". Opens at 7:00 AM. Unless Brian says otherwise.");
      }
      if (gate) {
        if (open) {
          var left = CLOSE - now;
          gate.textContent = left <= 60 ? "Open, closing in " + left + " min" : "Open now · closes 6:00\u00a0PM";
        } else {
          gate.textContent = "Closed · opens 7:00\u00a0AM";
        }
        gate.title = tip;
      }
    }
    update();
    setInterval(update, 60000);
  })();

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
