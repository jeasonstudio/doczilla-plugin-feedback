const path = require('path');
const url = require('url');
// const { getScrollHeight, getScrollTop, getWindowHeight } = require('./utils');

class Feedback extends doczilla.Plugin {
  constructor(options, doczilla) {
    super(options, doczilla);
    const FeedbackOpt = {
      name: 'feedback',
      render: this.render.bind(this),
    };
    doczilla.on('place', e => e.places.push(FeedbackOpt));
  }

  render(opt) {
    const {
      param,
      doc: { root, filename },
    } = opt;

    const [before, after] = param.trim().split('{path}');
    const fileOriginPath = url.resolve(url.resolve(before, filename), after);
    const origin = new URL(fileOriginPath);
    const [_, group, repo] = origin.pathname.split('/');
    const issueUrl = `${origin.origin}/${group}/${repo}/issues/new`;

    const filenameElement = `<input id="_fb_filename" value="${filename}" />`;
    const repoElement = `<input id="_fb_repo" value="${fileOriginPath}" />`;
    const issueElement = `<input id="_fb_issue" value="${issueUrl}" />`;
    return `<div style="display: none;">${filenameElement}${repoElement}${issueElement}</div>`;
  }
}

module.exports = Feedback;
