import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import randomInt from 'random-int';

const path = './data.json';

const makeCommits = async () => {
    const n = randomInt(0, 10);
    const skipDays = [0, 4, 7];

    if (skipDays.includes(n)) {
        console.log(`🛑 Skipping commits today. Random number was ${n}`);
        return;
    }

    const git = simpleGit();

    for (let i = 0; i < n; i++) {
        const date = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        const data = { date, commit: i + 1 };
        process.env.GIT_AUTHOR_DATE = date;
        process.env.GIT_COMMITTER_DATE = date;

        await jsonfile.writeFile(path, data);
        await git.add('.')
            .commit(`Auto commit ${i + 1} on ${date}`, { '--date': date });

        console.log(`✅ Commit ${i + 1} made on ${date}`);
    }

    await git.push();
    console.log(`🚀 Pushed ${n} commit(s)`);
};

makeCommits();
