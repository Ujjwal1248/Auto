import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import randomInt from 'random-int';

const path = './data.json';

const makeCommits = async (n) => {
    for (let i = 0; i < n; i++) {
        const x = randomInt(0, 54); // weeks
        const y = randomInt(0, 6);  // days

        const date = moment()
            .subtract(1, 'years')
            .add(x, 'weeks')
            .add(y, 'days')
            .format();

        const data = { date };

        await jsonfile.writeFile(path, data);
        await simpleGit().add('.')
            .commit(date, { '--date': date })
            .push();

        console.log(`✅ Commit made on ${date}`);
    }
};

makeCommits(14);
