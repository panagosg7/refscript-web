<?php

// 
// ACTIONS
//

// 0. List files
define("LIST_FILES", 0);
// 1. Fetch file
define("FETCH_FILE", 1);
// 2. Verify file
define("VERIFY_FILE", 2);


function verifyCmd($tsrc, $bindir, $logfile) {
  $cmd_lang    = 'LANG=en_US.UTF-8'; 
  $cmd_path    = 'PATH='.$bindir.':$PATH';
  $cmd_checker = 'rsc';
  // $cmd_checker = 'rsc';
  $pipe_out    = '>';
  $pipe_err    = '2>&1';
  $cmd         = implode(' ', array($cmd_lang,$cmd_path,$cmd_checker,$tsrc,$pipe_out,$logfile,$pipe_err));
  return $cmd;
}

function writeFileRaw($fname, $rawstring){
  $f = fopen($fname, "w");
  fwrite($f, $rawstring);
  fclose($f);
}

function getCrash($logfile){ 
  $wflag = 0;
  $crash = "";
  $fh    = fopen($logfile, 'r');

  while (!feof($fh)){
    $s = fgets($fh);
    if (strpos($s, "*** ERROR ***") !== false){
      $wflag    = $wflag + 1;
    } 
    if ($wflag == 3){
      $crash = $crash . $s;
    }
  } 
  fclose($fh);
  return $crash;
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////// Top Level Server //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


// Get inputs
$raw_data       = file_get_contents("php://input");
$data           = json_decode($raw_data);

$bindir         = "/var/www/refscript-bin/RefScript/.cabal-sandbox/bin";
$vardir         = "/var/tmp";
$testdir        = "/var/www/refscript-bin/RefScript/tests";

$logdir         = "./log";

if ($data->action == LIST_FILES) {

  // *NIX: find $testdir -name "*.ts"
  $find_cmd     = 'find'.' '.$testdir.' '.'-name'.' '.'"*.ts"';
  $out          = shell_exec($find_cmd);
  $out_array_0  = preg_split('/\s+/', $out);
  $n            = strlen($testdir) + 1;
  $out_array_1  = array_map(function($s) use ($n){ return(substr($s,$n));}, $out_array_0);
  echo json_encode($out_array_1);

  //// Tree command with -J prints JSON tree
  //$tree_cmd   = 'tree'.' '.$testdir.' '.'-J -P "*.ts"'; 
  //echo json_encode(shell_exec($tree_cmd),JSON_UNESCAPED_UNICODE);
   
}
else if ($data->action == FETCH_FILE) {

  $full_path     = $testdir.'/'.$data->rel_path;
  $cat_cmd      = 'cat'.' '.$full_path;
  echo shell_exec($cat_cmd);

}
else if ($data->action == VERIFY_FILE) {

  // Generate temporary filenames 
  $t            = time();
  $tsrc         = $vardir.'/'.$t.'.ts';
  $thtml        = $tsrc.'.html';
  $tout         = $tsrc.'.out';
  $terr         = $tsrc.'.err';
  $tjson        = $tsrc.'.json';
  $logfile      = $tsrc.'.log';

  writeFileRaw($tsrc, $data->program);

  // Run solver

  $ver_cmd      = verifyCmd($tsrc,$bindir,$logfile);
  error_log($ver_cmd);
  $out          = shell_exec($ver_cmd);  
  echo shell_exec('cat '.$logfile);

  //writeFileRaw("cmdlog", $cmd);
  //$res              = shell_exec($cmd);

  //// Parse results
  //// $out              = getResultAndWarns($tout) ;
  //$out              = array();
  //$out['crash']     = getCrash($log)           ;       
  //$out['annotHtml'] = file_get_contents($thtml);
  //$out['annots']    = json_decode(file_get_contents($tjson));

  //// echo 'result = ' . $out['result'];
  //// echo 'warns = '  . $out['warns'];

  //// Cleanup temporary files
  //// shell_exec("rm -rf ".$tsrc."hi");
  //// shell_exec("rm -rf ".$tsrc."o");
  //shell_exec("mv ".$t."* saved/");

  //// Put outputs 
  //echo json_encode($out);

}

?>
