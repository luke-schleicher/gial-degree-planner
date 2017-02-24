planner.controller('MeetingsIndexCtrl', ['$scope', 'courses', 'meetingService', '_', 'Auth',
  function($scope, courses, meetingService, _, Auth) {
    $scope.courses = courses;
    var years = ["2017", "2018", "2019", "2020"];
    var terms = ["Spring", "Summer", "Fall"];
    $scope.termHeader = [];
    years.forEach(function(year) {
      $scope.termHeader.push(year);
      $scope.termHeader.push.apply($scope.termHeader, terms);
    });

    Auth.currentUser()
      .then(function(advisor) {
        $scope.advisor = advisor;
        console.log($scope.advisor)
      }, function(error) {
        console.error(error);
      });

    var meetings = [];
    courses.forEach(function getCourseAttendance(course) {
      meetings.push.apply(meetings, course.meetings);
      course.attendance = [];
      years.forEach(function(year) {
        var yearAttendance = {
          spring: {},
          summer: {},
          fall: {},
          any: {},
        };
        // find the course meeting for this year
        var thisYearsMeeting = course.meetings.filter(function(meeting) { return meeting.year === Number(year); })[0];
        var term = thisYearsMeeting.term.toLowerCase();
        yearAttendance[term] = {
          count: thisYearsMeeting.enrollments.length,
          meeting_id: thisYearsMeeting.id,
        };
        course.attendance.push("", yearAttendance.spring, yearAttendance.summer, yearAttendance.fall);
      });
    });

    $scope.newCourse = {};
    $scope.course = {};

    $scope.showNewCourseModal = function() {
      angular.element('#new-course-form').modal('show');
    };

    $scope.showEditCourseModal = function(course) {
      angular.copy(course, $scope.course);
      angular.element('#edit-course-form').modal('show');
    };

    $scope.showMeeting = function(id) {
      meetingService.get(id)
        .then(function(meeting) {
          $scope.meeting = meeting;
          angular.element('#edit-meeting').modal('show');
        }, function(error) {
          console.error(error);
        });
    };
  }
]);
