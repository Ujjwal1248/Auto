import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import randomInt from 'random-int';

const path = './data.json';

const makeCommits = async () => {
    const n = randomInt(0, 10); // 👈 Random number of commits
    const git = simpleGit();

    for (let i = 0; i < n; i++) {
        const date = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        const data = { date, commit: i + 1 };
        process.env.GIT_AUTHOR_DATE = date;
        process.env.GIT_COMMITTER_DATE = date;

        await jsonfile.writeFile(path, data);
        await git.add('.')
            .commit(`Daily commit ${i + 1} on ${date}`, { '--date': date });

        console.log(`✅ Commit ${i + 1} made on ${date}`);
    }

    if (n > 0) {
        await git.push();
        console.log(`🚀 Pushed ${n} commit(s)`);
    } else {
        console.log('🛌 No commits today (0 picked)');
    }
};

makeCommits();