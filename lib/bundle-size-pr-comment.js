import fetch from 'node-fetch';
import execa from 'execa';
import env from './env';

export default async () => {
    // Get bundle size message.
    // Don't fail ci because we couldn't get bundle information, just return.
    let bundleSizeMessage;
    try {
        const { stdout } = await execa('origami-bundle-size');
        bundleSizeMessage = stdout;
    } catch (error) {
        console.log(error.message);
        return;
    }

    // Log the bundle size message.
    console.log(bundleSizeMessage);

    // Find the PR number to post the bundle size message to.
    // Don't fail ci if no PR number is found, just return.
    if (!env.pullRequestUrl) {
        console.log('No pull request url to post bundle information to.');
        return;
    }

    const prNumber = env.pullRequestUrl.match(/([0-9]+)$/)[0];
    if(!prNumber) {
        console.log('No pull request number to post bundle information to.');
        return;
    }

    // Post bundle size message to the Github PR.
    // Don't fail ci because we couldn't post bundle information.
    try {
        const host = `api.github.com`;
        const path = `repos/Financial-Times/${env.name}/issues/${prNumber}/comments`;
        const githubEndpoint = `https://${host}/${path}`;
        const response = await fetch(githubEndpoint, {
            method: 'POST',
            body: JSON.stringify({ body: bundleSizeMessage }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${ env.githubToken }`
            }
        });

        if (!response.ok) {
            console.log(
                `Could not post a bundle size comment to "${githubEndpoint}".` +
                `Status: ${response.status}.`
            );
        }
    } catch (error) {
        console.log(
            `There was an error posting bundle information to "${githubEndpoint}".`,
            error
        );
    }
};
