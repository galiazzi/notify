module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            all: ["dist"]
        },

        mocha: {
            index: ["test/test.html"],
            options: {
                run: true
            }
        },

        concat: {
            notify: {
                src: ["src/notify.js"],
                dest: "dist/notify.js"
            },
            "notify-css": {
                src: ["src/notify.css"],
                dest: "dist/notify.css"
            }
        },

        uglify: {
            notify: {
                files: {
                    "dist/notify.min.js": ["dist/notify.js"]
                }
            }
        },

        cssmin: {
            notify: {
                expand: true,
                cwd: 'dist',
                src: ['*.css', '!*.min.css'],
                dest: 'dist/',
                ext: '.min.css'
            }
        },

        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ["img/*"],
                        dest: 'dist/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("dist", ["clean", "concat", "uglify", "cssmin", "copy"]);
    grunt.registerTask("default", ["dist"]);
};
