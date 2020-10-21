
//social links
const socials = [
  { "href": "https://github.com/AlexDoytch", "src": "https://simpleicons.org/icons/github.svg" },
  { "href": "https://www.linkedin.com/in/alex-doytchinov-583085117/", "src": "https://simpleicons.org/icons/linkedin.svg" }
]
// Links for JSON
const links =  [{ name: "Google", url: "https://www.google.com"},
{ name: "ESPN", url: "https://www.espn.com" },
{ name: "YouTube", url: "https://www.youtube.com" }];

const error_page = `
  <!DOCTYPE html>
  <body>
    <h1>Something's up. We'll try to fix it.</h1>
  </body>`;

/* Element handlers */


class ProfileHandler {
  element (ele) {
    // Remove the `display: none` from the `div#profile` container
    ele.removeAttribute('style');
  }
}

class LinkHandler {
      // Nest in parent
  element (parentElement) {
    links.forEach((link) => {
      parentElement.append(`<a href="${link.url}" rel="noopener" target="_blank">${link.name}</a>`, { html: true });
    });
  }
}

class NameHandler {
  element (ele) {
    ele.setInnerContent("Alex Doytchinov");
  }
}

class PhotoHandler {
  element (ele) {
    ele.setAttribute('src', 'https://media-exp1.licdn.com/dms/image/C5603AQFh11ijb9ZEIA/profile-displayphoto-shrink_400_400/0?e=1608768000&v=beta&t=R0akAcQ8zPeaBicPNrgfjaawUVTXRegdRrm8ByPpNKk');
  }
}
class SocialMediaHandler {
  element (ele) {
    ele.removeAttribute('style');
    socials.forEach((link) => {
      ele.append(`<a href="${link.href}" rel="noopener" target="_blank"><img src="${link.src}"/></a>`, { html: true });
    });
  }
}

class BackColorHandler {
  element (ele) {
    // Change the background color
    ele.setAttribute("style", "background-color: #de3618");
  }
}

class TitleHandler {
  element (ele) {
    ele.setInnerContent("Alex Doytchinov");
  }
}
/* HTMLRewriter instance */

const rewriter = new HTMLRewriter()
  .on('div#social', new SocialMediaHandler())
  .on('div#profile', new ProfileHandler())
  .on('img#avatar', new PhotoHandler())
  .on('body', new BackColorHandler())
  .on('h1#name', new NameHandler())
  .on('div#links', new LinkHandler())
  .on('title', new TitleHandler());

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    var url_end = request.url.substring(request.url.lastIndexOf('/') + 1);
    // If a link
    if (url_end == 'links') {
      let json = JSON.stringify(links)
      return new Response(json, { headers: { 'Content-Type': 'application/json' } });
    }
    //if not a link
    const html_link = 'https://static-links-page.signalnerve.workers.dev';
    const responseHTML = await fetch(html_link, { headers: { "content-type": "text/html;charset=UTF-8" } });

    return rewriter.transform(responseHTML);

  } catch (err) {
    console.log(err);
    return new Response(error_page, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
}

/**
 * This function defines triggers for a worker script to execute.
 * `fetch` event will passes FetchEvent as argument in handler function.
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
