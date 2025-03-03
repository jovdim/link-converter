const affiliateCodes = {
  AllChinaBuy: "&partnercode=wrf7xD",
  AcBuy: "&u=9MLILB",
  CNFans: "&ref=71427",
  OrientDig: "&ref=100005658",
  Sugargoo: "&memberId=341947205705269884",
};

const agents = [
  {
    name: "AllChinaBuy",
    generateLink: (rawLink, itemId, storeType) =>
      `https://www.allchinabuy.com/en/page/buy?from=search-input&url=${encodeURIComponent(
        rawLink
      )}${affiliateCodes.AllChinaBuy}`,
  },
  {
    name: "AcBuy",
    generateLink: (rawLink, itemId, storeType) =>
      `https://www.acbuy.com/product/?id=${itemId}&source=${
        storeType === "weidian" ? "WD" : storeType === "ali_1688" ? "AL" : "TB"
      }${affiliateCodes.AcBuy}`,
  },
  {
    name: "CNFans",
    generateLink: (rawLink, itemId, storeType) =>
      `https://cnfans.com/product/?shop_type=${storeType}&id=${itemId}${affiliateCodes.CNFans}`,
  },
  {
    name: "OrientDig",
    generateLink: (rawLink, itemId, storeType) =>
      `https://orientdig.com/product/?shop_type=${storeType}&id=${itemId}${affiliateCodes.OrientDig}`,
  },
  {
    name: "Sugargoo",
    generateLink: (rawLink, itemId, storeType) =>
      `https://www.sugargoo.com/#/home/productDetail?productLink=${encodeURIComponent(
        rawLink
      )}${affiliateCodes.Sugargoo}`,
  },
];

function extractItemId(url) {
  let match = url.match(/itemID=(\d+)|offer\/(\d+)\.html|id=(\d+)/);
  return match ? match[1] || match[2] || match[3] : null;
}

function getStoreType(url) {
  if (url.includes("weidian.com")) return "weidian";
  if (url.includes("1688.com")) return "ali_1688";
  if (url.includes("taobao.com")) return "taobao";
  return null;
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    button.textContent = "Copied!";
    setTimeout(() => (button.textContent = "Copy"), 1500);
  });
}

function convertLink() {
  let rawLink = document.getElementById("rawLink").value.trim();
  let itemId = extractItemId(rawLink);
  let storeType = getStoreType(rawLink);

  if (!itemId || !storeType) {
    document.getElementById("output").innerHTML = "Invalid link!";
    return;
  }

  let outputHtml = "<h2>Converted Links:</h2>";
  agents.forEach((agent) => {
    let link = agent.generateLink(rawLink, itemId, storeType);
    outputHtml += `
            <div class="link-container"><strong>${agent.name}: </strong>
                <span class="link-text"><a href="${link}" target="_blank">${link}</a></span>
                <button class="copy-btn" onclick="copyToClipboard('${link}', this)">Copy</button>
            </div>`;
  });

  document.getElementById("output").innerHTML = outputHtml;
}
