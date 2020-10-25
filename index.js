
function getLinks() {
  return[
    {
      "name": "Linkedin",
      "url": "https://www.linkedin.com/in/neelanshisharma" 
    },
    {
      "name": "Github",
      "url": "https://www.github.com/ns-github14" 
    },
    {
      "name": "Twitter",
      "url": "https://www.twitter.com/sharmaneelanshi" 
    }
  ]
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  //get linktree-style extensions
  route = request.url.split(".")
  route = route[route.length - 1].split("/")[1]

  if (request.method != "GET") {
    return encodeError("Incorrect request type, this route only handles 'GET' requests.", 400)
  }

  //return JSON object for link array
  if (route === "links") {
    return new Response(JSON.stringify(getLinks()), {
      headers: { 'content-type': 'application/json' },
      status: 200
    })
  } 
  else {
    const response = await fetch("https://static-links-page.signalnerve.workers.dev")
    const AVATAR_URL = "https://avatars2.githubusercontent.com/u/65951560?s=400&u=9407a6d7efb303c0a6f8b8cae7cae97a3ecd148a&v=4"
    return new HTMLRewriter().on("div#profile", new AttributeTransformer("style", "font-size: 25px;"))
                             .on("img#avatar", new AttributeAppender("src", AVATAR_URL))
                             .on("h1#name",  new ElementAppender("Neelanshi Sharma", false, false))
                             .on("div#social", new AttributeTransformer("style", null))
                             .on("div#social", new ElementAppender("<a href=https://github.com/ns-github14><img src=\"https://simpleicons.org/icons/github.svg\"" + "/></a><a href=https://twitter.com/sharmaneelanshi><img src=\"https://simpleicons.org/icons/twitter.svg\"" + "/></a>", true, false))
                             .on("body", new AttributeAppender("style", "background-color: orange;"))
                             .on("div#links", new LinksTransformer(getLinks()))
                             .on("title", new ElementAppender("<title>Neelanshi Sharma</title>", true, true))
                             .transform(response)
    }
  }

function encodeError(error, statusCode) {
  let errorResponse = {
    "error": error,
  }
  return new Response(JSON.stringify(errorResponse), {
    headers: { 'content-type': 'application/json' },
    status: statusCode
  })
}

class LinksTransformer {

  constructor(links) {
    this.links = links;
  }

  async element(element) {
    this.links.forEach(link => element.append("<a href=" + link.url + ">" + link.name + "</a>", { html: true }))
  }

}

class AttributeTransformer {

  constructor(target, attr) {
    this.target = target;
    this.attr = attr;
  }

  async element(element) {
    if (this.attr == null) {
      element.removeAttribute(this.target)
    } else {
      element.setAttribute(this.target, this.attr)
    }
  }

}

class AttributeAppender {

  constructor(target, attrAppendix) {
    this.target = target;
    this.attrAppendix = attrAppendix;
  }

  async element(element) {
    if (element.hasAttribute(this.target)) {
      element.setAttribute(this.target, element.getAttribute(this.target) + this.attrAppendix)
    } else {
      element.setAttribute(this.target, this.attrAppendix)
    }
  }

}


class ElementAppender {

  constructor(appendix, isHtml, replace) {
    this.appendix = appendix;
    this.isHtml = isHtml;
    this.replace = replace;
  }

  async element(element) {
    if (this.replace) {
      element.replace(this.appendix, { html: this.isHtml })
    } else {
      element.append(this.appendix, { html: this.isHtml })
    }

  }

}

