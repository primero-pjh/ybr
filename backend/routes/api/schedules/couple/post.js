const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
const jwtFunc = require(`${path}/jwt`);
let CRT_ERROR_CODE = require(`${path}/error_code`);

router.post('/api/schedules/couple/:coupleInfoId', async (req, res, next) => {
    const db = require(`${path}/mysql2`);
    let schedule = req.body.params.schedule;
    let user_dict = require(`${path}/app`)["user_dict"];
    let coupleInfoId = req.params.coupleInfoId;
    if(coupleInfoId == 0) {
        return res.json({
            success: 0,
            code: "COUPLE_EMPTY_ERROR",
            message: CRT_ERROR_CODE["COUPLE_EMPTY_ERROR"],
        });
    }
    
    if(!schedule.title) {
        schedule.title = '(제목없음)';
    }

    let [results] = await db.query(`
        insert into schedules
        (
            coupleInfoId, calendarId, title, body, isAllday, 
            start, end, location, attendees, category,
            dueDateClass, isVisible, isPending, isFocused, isPrivate,
            dateAdded, dateDeleted, status
        )
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [coupleInfoId, 0, schedule.title, schedule.body, (schedule.isAllday ? 1 : 0), schedule.start, schedule.end,
        schedule.location, JSON.stringify(schedule.attendees), schedule.category, schedule.dueDateClass, 1, 0,
        0, 0, new Date(), null, 1
    ]);
    let id = results.insertId;
  
    return res.json({
        success: 1,
        message: '일정을 추가하였습니다.',
    });
});

module.exports = router;