#!/usr/bin/env bash

set -euo pipefail

WANTED_OR_BELOW=35

if nmcli | grep realraum >/dev/null; then
  CURBRI=$(curl -s http://quadrings.iot.realraum.at/settings/s.js?p=2 | grep "BF.value=[0-9]*" -o | grep -o "[0-9]*" | grep "BF.value=[0-9]*" -o | grep -o "[0-9]*")
  echo "bri $CURBRI"
  if [ $CURBRI -gt "$WANTED_OR_BELOW" ]; then
    echo "BRI! $CURBRI -> $WANTED_OR_BELOW"
    pup "$WANTED_OR_BELOW"
  fi
fi

