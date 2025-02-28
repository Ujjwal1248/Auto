import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import randomInt from 'random-int';

const path = './data.json';
const git = simpleGit();

function generateDates() {
    const start = moment("2025-03-01");
    const end = moment("2025-07-31");
    const days = [];

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
        days.push(current.clone());
        current.add(1, 'day');
    }

    // Pick ~95% of days
    return days.filter(() => Math.random() < 0.95);
}

async function makeCommits() {
    const dates = generateDates();

    for (const day of dates) {
        const commitCount = randomInt(5, 15); // Multiple commits per day
        const timestamps = [];

        // Generate random commit times for the day
        for (let i = 0; i < commitCount; i++) {
            const hour = randomInt(0, 23);
            const minute = randomInt(0, 59);
            const second = randomInt(0, 59);

            timestamps.push(
                moment(day.format("YYYY-MM-DD") + `T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`)
            );
        }

        // Sort timestamps so commits happen in chronological order
        timestamps.sort((a, b) => a - b);

        // Make commits for the day
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
    }

    // Push all commits once at the end
    await git.push();
    console.log(`🚀 All commits pushed successfully`);
}

makeCommits();
