import { withPluginApi } from "discourse/lib/plugin-api";
import User from "discourse/models/user";

export default {
  name: "lang-switch-init",
  initialize(container) {
    const site = container.lookup("site:main");

    withPluginApi("0.8.32", (api) => {
      api.decorateWidget("header-buttons:before", (helper) => {
        let currentUser = User.current();
        if (currentUser) {
          helper.widget.cust_lang = I18n.currentLocale();
          helper.widget.switchLanguage = function () {
            let locale = I18n.currentLocale();
            locale = locale == "en" ? "zh_CN" : "en";
            currentUser.set("locale", locale);
            currentUser.set("user_option", {});
            currentUser.save(["locale"]).then((result) => {
              window.location.reload();
            });
          };

          return helper.attach("button", {
            label: themePrefix("switch_text"),
            className: "btn-primary btn-small sign-up-button",
            action: "switchLanguage",
          });
        }
      });
    });
  },
};
