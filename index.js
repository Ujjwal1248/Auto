import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import randomInt from 'random-int';

const path = './data.json';

const makeCommits = async () => {
    const n = randomInt(0, 10); // Random number of commits
    const skipDays = [0, 4, 8];

    if (skipDays.includes(n)) {
        console.log(`🛑 Skipping commits today. Random number was ${n}`);
        return;
    }

    console.log(`🔁 Will make ${n} commits today`);

    const git = simpleGit();

    // Get today's date (YYYY-MM-DD)
    const baseDate = moment().format('YYYY-MM-DD');

    // Generate random times for today
    const timestamps = [];
    for (let i = 0; i < n; i++) {
        const hour = randomInt(0, 23);
        const minute = randomInt(0, 59);
        const second = randomInt(0, 59);

        const timestamp = moment(`${baseDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
        timestamps.push(timestamp);
    }

    // Sort timestamps to ensure commits happen in order
    timestamps.sort((a, b) => a - b);

    // Do the commits
    for (let i = 0; i < timestamps.length; i++) {
        const date = timestamps[i].format('YYYY-MM-DDTHH:mm:ssZ');
        const data = { commit: i + 1, date };

        process.env.GIT_AUTHOR_DATE = date;
        process.env.GIT_COMMITTER_DATE = date;

        await jsonfile.writeFile(path, data);
        await git.add('.')
            .commit(`Auto commit ${i + 1} at ${date}`, { '--date': date });

        console.log(`✅ Commit ${i + 1} made at ${date}`);
    }

    await git.push();
    console.log(`🚀 Pushed all ${n} commits`);
};

makeCommits();
