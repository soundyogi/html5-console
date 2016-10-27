#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
LYCHEEJS_HELPER=`which lycheejs-helper`;

if [ "$LYCHEEJS_HELPER" == "" ]; then
	LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper.sh";
fi;


if [ -e "$LYCHEEJS_HELPER" ]; then

	cd $PROJECT_ROOT;
	mkdir -p $PROJECT_ROOT/build/html;

	"$LYCHEEJS_HELPER" env:node ./bin/build-project.js;

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

