"use strict";

class HomeController {

    index($view) {
        return $view.render('index');
    }

    user($view, $model, $routeParams, $response, $wait, $get) {
        var User = $model.get('User');
        var user = User.findById($routeParams.get('id'), function(err, user) {
            if (!err) {
                $view.data.user = user;
                $wait.stop($view.render('user'));
            } else {
                $response.origin.redirect('/users');
            }
        });

        return $wait;
    }

    users($view, $wait, $model) {

        var User = $model.get('User');

        User.find({}, function(err, users) {
            $view.data.users = users;
            $wait.stop($view.render('users'));
        });
        return $wait;
    }

    store($post, $response, $model, $wait) {
        var username = $post.get('username');
        var User = $model.get('User');
        var user = new User();
        
        user.username = username;
        user.save(function() {
            $response.origin.redirect('/users');
        });

        return $wait;
    }

    delete($routeParams, $model, $response, $wait) {
        var User = $model.get('User');
        var user = User.findById($routeParams.get('id'), function(err, user) {
            if (user) {
                user.remove();
            }

            $response.origin.redirect('back');
        });
        
        return $wait;
    }

}

module.exports = HomeController;