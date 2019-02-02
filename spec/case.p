program TEST;
var
  i : integer;
   
begin
   for i := 5 to 20 do begin
      case 2*i of
	17	 : writeln(1111);
	28	 : begin
		      writeln(17);
		      writeln(171717);
		   end;
	24	 : writeln(24);
	20,22,26 : writeln(1000);
	30,40,18 :
		  begin
		     case 3*i of
	60 : writeln(1000);
	45 :  writeln  (10000);
      end;
		  end;
      end;
   end;
end.

