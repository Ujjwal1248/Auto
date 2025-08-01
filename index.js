import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = './data.json';

const makeCommits = async (n) => {
    for (let i = 0; i < n; i++) {
        const date = moment().format('YYYY-MM-DDTHH:mm:ssZ'); // Today's date with time zone

        const data = { date };
        process.env.GIT_AUTHOR_DATE = date;
        process.env.GIT_COMMITTER_DATE = date;

        await jsonfile.writeFile(path, data);
        await simpleGit().add('.')
            .commit(`Commit ${i + 1} on ${date}`, { '--date': date })
            .push();

        console.log(`✅ Commit ${i + 1} made on ${date}`);
    }
};

makeCommits(45); // You can change the number here
